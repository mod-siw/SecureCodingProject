import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import sql from "@/lib/db";

// GET - 특정 게시물 조회
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = await sql`
      SELECT posts.*, users.username, users.name
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE posts.id = ${id}
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "게시물을 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    return NextResponse.json({ post: result.rows[0] });
  } catch (error) {
    console.error("게시물 조회 에러:", error);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

// DELETE - 게시물 삭제
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await request.json();

    console.log("게시물 삭제 요청:", { postId: id, userId });

    if (!userId) {
      return NextResponse.json(
        { error: "사용자 ID가 필요합니다" },
        { status: 400 }
      );
    }

    // 게시물 소유자 확인
    const postResult = await sql`
      SELECT user_id, image_path
      FROM posts
      WHERE id = ${id}
    `;

    if (postResult.rows.length === 0) {
      return NextResponse.json(
        { error: "게시물을 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    const post = postResult.rows[0];

    // 권한 확인
    if (post.user_id !== userId) {
      return NextResponse.json(
        { error: "삭제 권한이 없습니다" },
        { status: 403 }
      );
    }

    // Vercel Blob에서 이미지 삭제
    try {
      await del(post.image_path);
      console.log("✅ 이미지 삭제 완료:", post.image_path);
    } catch (blobError) {
      console.warn("⚠️ 이미지 삭제 실패 (계속 진행):", blobError);
    }

    // 댓글 삭제 (CASCADE로 자동 삭제되지만 명시적으로)
    await sql`DELETE FROM comments WHERE post_id = ${id}`;

    // 좋아요 삭제
    await sql`DELETE FROM likes WHERE post_id = ${id}`;

    // 게시물 삭제
    await sql`DELETE FROM posts WHERE id = ${id}`;

    console.log("✅ 게시물 삭제 완료:", id);

    return NextResponse.json({ message: "게시물이 삭제되었습니다" });
  } catch (error) {
    console.error("게시물 삭제 에러:", error);
    const errorMessage = error instanceof Error ? error.message : "서버 오류";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import sql from "@/lib/db";

interface CommentRequestBody {
  userId: number;
  postId: number;
  text: string;
}

export async function POST(request: Request) {
  try {
    const { userId, postId, text } =
      (await request.json()) as CommentRequestBody;

    if (!userId || !text) {
      return NextResponse.json(
        { error: "사용자 ID와 댓글 내용이 필요합니다" },
        { status: 400 }
      );
    }

    if (!postId) {
      return NextResponse.json(
        { error: "게시물 ID가 필요합니다" },
        { status: 400 }
      );
    }

    console.log(`[API] 댓글 생성 요청: user ${userId} on post ${postId}`);

    const result = await sql`
      INSERT INTO comments (user_id, post_id, text)
      VALUES (${userId}, ${Number(postId)}, ${text})
      RETURNING *
    `;

    const newComment = result.rows[0];
    console.log(`[API] 댓글 생성 완료:`, newComment.id);

    return NextResponse.json({
      message: "댓글이 작성되었습니다",
      comment: newComment,
    });
  } catch (error) {
    console.error("댓글 작성 API 에러:", error);
    const errorMessage = error instanceof Error ? error.message : "서버 오류";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

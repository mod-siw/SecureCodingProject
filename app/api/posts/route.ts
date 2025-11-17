import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import sql from "@/lib/db";

// GET - 모든 게시물 조회 (동일)
export async function GET() {
  try {
    const postsResult = await sql`
      SELECT 
        posts.*,
        users.username,
        users.name,
        users.profile_pic,
        COUNT(DISTINCT likes.id) as like_count
      FROM posts
      LEFT JOIN users ON posts.user_id = users.id
      LEFT JOIN likes ON posts.id = likes.post_id
      GROUP BY posts.id, users.id, users.username, users.name, users.profile_pic
      ORDER BY posts.created_at DESC
    `;

    const postsWithDetails = await Promise.all(
      postsResult.rows.map(async (post) => {
        const commentsResult = await sql`
          SELECT 
            comments.*, 
            users.username, 
            users.profile_pic 
          FROM comments
          JOIN users ON comments.user_id = users.id
          WHERE comments.post_id = ${post.id}
          ORDER BY comments.created_at ASC
        `;

        const likesResult = await sql`
          SELECT user_id
          FROM likes
          WHERE post_id = ${post.id}
        `;

        return {
          ...post,
          comments: commentsResult.rows,
          likedBy: likesResult.rows.map((l) => l.user_id),
          likes: parseInt(String(post.like_count)) || 0,
        };
      })
    );

    return NextResponse.json({ posts: postsWithDetails });
  } catch (error) {
    console.error("게시물 조회 에러:", error);
    const errorMessage = error instanceof Error ? error.message : "서버 오류";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST - 게시물 생성 (Vercel Blob 사용)
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const userId = formData.get("userId");
    const caption = formData.get("caption");
    const image = formData.get("image");

    if (!userId || !image || !(image instanceof File)) {
      return NextResponse.json(
        { error: "필수 정보가 누락되었습니다" },
        { status: 400 }
      );
    }

    // Vercel Blob에 이미지 업로드
    const blob = await put(`posts/${Date.now()}-${image.name}`, image, {
      access: "public",
      addRandomSuffix: true,
    });

    console.log("✅ 이미지 업로드 완료:", blob.url);

    // PostgreSQL에 게시물 정보 저장
    const result = await sql`
      INSERT INTO posts (user_id, image_path, caption)
      VALUES (${userId as string}, ${blob.url}, ${caption as string | null})
      RETURNING id
    `;

    return NextResponse.json({
      message: "게시물 업로드 성공",
      postId: result.rows[0].id,
      imagePath: blob.url,
    });
  } catch (error) {
    console.error("게시물 업로드 에러:", error);
    const errorMessage = error instanceof Error ? error.message : "서버 오류";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

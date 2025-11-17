import { NextResponse } from "next/server";
import sql from "@/lib/db";

interface LikeRequest {
  userId: number;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as LikeRequest;
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "사용자 ID가 필요합니다" },
        { status: 400 }
      );
    }

    // 이미 좋아요를 눌렀는지 확인
    const likeCheck = await sql`
      SELECT id FROM likes
      WHERE user_id = ${userId} AND post_id = ${id}
    `;

    if (likeCheck.rows.length > 0) {
      // 좋아요 취소
      await sql`
        DELETE FROM likes
        WHERE user_id = ${userId} AND post_id = ${id}
      `;
      return NextResponse.json({ message: "좋아요 취소", liked: false });
    } else {
      // 좋아요 추가
      await sql`
        INSERT INTO likes (user_id, post_id)
        VALUES (${userId}, ${id})
      `;
      return NextResponse.json({ message: "좋아요", liked: true });
    }
  } catch (error) {
    console.error("좋아요 에러:", error);
    const errorMessage = error instanceof Error ? error.message : "서버 오류";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

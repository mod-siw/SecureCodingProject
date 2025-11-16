import { NextResponse } from "next/server";
import db from "@/lib/db";
import { Like } from "@/types/database";

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

    console.log("좋아요 요청:", { postId: id, userId });

    if (!userId) {
      return NextResponse.json(
        { error: "사용자 ID가 필요합니다" },
        { status: 400 }
      );
    }

    return new Promise<NextResponse>((resolve) => {
      db.get(
        "SELECT id FROM likes WHERE user_id = ? AND post_id = ?",
        [userId, id],
        (err: Error | null, like: Pick<Like, "id"> | undefined) => {
          if (err) {
            console.error("좋아요 조회 에러:", err);
            resolve(NextResponse.json({ error: err.message }, { status: 500 }));
            return;
          }

          if (like) {
            // 좋아요 취소
            db.run(
              "DELETE FROM likes WHERE user_id = ? AND post_id = ?",
              [userId, id],
              (err: Error | null) => {
                if (err) {
                  console.error("좋아요 취소 에러:", err);
                  resolve(
                    NextResponse.json({ error: err.message }, { status: 500 })
                  );
                } else {
                  console.log("좋아요 취소 성공");
                  resolve(
                    NextResponse.json({ message: "좋아요 취소", liked: false })
                  );
                }
              }
            );
          } else {
            // 좋아요 추가
            db.run(
              "INSERT INTO likes (user_id, post_id) VALUES (?, ?)",
              [userId, id],
              (err: Error | null) => {
                if (err) {
                  console.error("좋아요 추가 에러:", err);
                  resolve(
                    NextResponse.json({ error: err.message }, { status: 500 })
                  );
                } else {
                  console.log("좋아요 추가 성공");
                  resolve(
                    NextResponse.json({ message: "좋아요", liked: true })
                  );
                }
              }
            );
          }
        }
      );
    });
  } catch (error) {
    console.error("좋아요 API 에러:", error);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

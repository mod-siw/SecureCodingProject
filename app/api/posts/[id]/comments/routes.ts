import { NextResponse } from "next/server";
import db from "@/lib/db";
import { Comment } from "@/types/database";

interface CommentRequest {
  userId: number;
  text: string;
}

interface DBRunResult {
  lastID: number;
  changes: number;
}

// --- DB 헬퍼 함수 (Promise 반환) ---
const runQuery = (
  sql: string,
  params: (string | number)[]
): Promise<DBRunResult> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
  });
};

const getQuery = <T>(
  sql: string,
  params: (string | number)[]
): Promise<T | undefined> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row: T | undefined) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

const allQuery = <T>(
  sql: string,
  params: (string | number)[]
): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows: T[]) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows || []);
      }
    });
  });
};
// --- DB 헬퍼 끝 ---

// [POST] - 댓글 작성
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const body = (await request.json()) as CommentRequest;
    const { userId, text } = body;

    console.log("댓글 작성 요청:", { postId, userId, text });

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: "댓글 내용을 입력해주세요" },
        { status: 400 }
      );
    }
    if (!userId) {
      return NextResponse.json(
        { error: "사용자 ID가 필요합니다" },
        { status: 400 }
      );
    }

    // 1. 댓글 삽입
    const { lastID } = await runQuery(
      "INSERT INTO comments (user_id, post_id, text) VALUES (?, ?, ?)",
      [userId, postId, text]
    );

    console.log("댓글 작성 성공, ID:", lastID);

    // 2. 삽입된 댓글 조회 (사용자 이름 포함)
    const newComment = await getQuery<Comment>(
      `SELECT comments.*, users.username
       FROM comments
       JOIN users ON comments.user_id = users.id
       WHERE comments.id = ?`,
      [lastID]
    );

    if (!newComment) {
      console.error("삽입된 댓글을 찾을 수 없습니다.");
      return NextResponse.json(
        { error: "댓글을 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    console.log("댓글 조회 성공:", newComment);
    return NextResponse.json({ comment: newComment });
  } catch (error) {
    console.error("댓글 API 에러:", error);
    const errorMessage = error instanceof Error ? error.message : "서버 오류";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// [GET] - 댓글 조회
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    console.log("댓글 조회 요청, 게시물 ID:", postId);

    const comments = await allQuery<Comment>(
      `SELECT comments.*, users.username
       FROM comments
       JOIN users ON comments.user_id = users.id
       WHERE comments.post_id = ?
       ORDER BY comments.created_at ASC`,
      [postId]
    );

    console.log(`댓글 조회 성공: ${comments.length}개 조회됨`);
    return NextResponse.json({ comments });
  } catch (error) {
    console.error("댓글 GET API 에러:", error);
    const errorMessage = error instanceof Error ? error.message : "서버 오류";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

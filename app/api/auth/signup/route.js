import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request) {
  try {
    const { username, password, name } = await request.json();

    if (!username || !password || !name) {
      return NextResponse.json(
        { error: "모든 필드를 입력해주세요" },
        { status: 400 }
      );
    }

    return new Promise((resolve) => {
      db.run(
        "INSERT INTO users (username, password, name) VALUES (?, ?, ?)",
        [username, password, name],
        function (err) {
          if (err) {
            if (err.message.includes("UNIQUE")) {
              resolve(
                NextResponse.json(
                  { error: "이미 존재하는 사용자입니다" },
                  { status: 400 }
                )
              );
            } else {
              resolve(
                NextResponse.json({ error: "회원가입 실패" }, { status: 500 })
              );
            }
          } else {
            resolve(
              NextResponse.json({
                message: "회원가입 성공",
                userId: this.lastID,
              })
            );
          }
        }
      );
    });
  } catch (error) {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "아이디와 비밀번호를 입력해주세요" },
        { status: 400 }
      );
    }

    return new Promise((resolve) => {
      db.get(
        "SELECT id, username, name, profile_pic FROM users WHERE username = ? AND password = ?",
        [username, password],
        (err, user) => {
          if (err) {
            resolve(NextResponse.json({ error: "서버 오류" }, { status: 500 }));
          } else if (!user) {
            resolve(
              NextResponse.json(
                { error: "아이디 또는 비밀번호가 올바르지 않습니다" },
                { status: 401 }
              )
            );
          } else {
            resolve(
              NextResponse.json({
                user: {
                  id: user.id,
                  username: user.username,
                  name: user.name,
                  profilePic: user.profile_pic,
                },
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

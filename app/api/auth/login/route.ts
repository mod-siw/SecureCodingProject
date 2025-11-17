import { NextResponse } from "next/server";
import sql from "@/lib/db";
import bcrypt from "bcrypt"; // 1. bcrypt 임포트

interface LoginRequest {
  username: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginRequest;
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "아이디와 비밀번호를 입력해주세요" },
        { status: 400 }
      );
    }

    // 2. [수정] username으로 사용자 찾기 (암호화된 password 필드 포함)
    const result = await sql`
      SELECT id, username, name, profile_pic, password
      FROM users
      WHERE username = ${username}
    `;

    if (result.rows.length === 0) {
      // 사용자가 존재하지 않음
      return NextResponse.json(
        { error: "아이디 또는 비밀번호가 올바르지 않습니다" },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // 3. [수정] 입력된 비밀번호와 DB의 해시된 비밀번호 비교
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      // 비밀번호 불일치
      return NextResponse.json(
        { error: "아이디 또는 비밀번호가 올바르지 않습니다" },
        { status: 401 }
      );
    }

    // 4. 로그인 성공: 비밀번호를 제외한 사용자 정보 반환
    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        profilePic: user.profile_pic,
      },
    });
  } catch (error) {
    console.error("로그인 에러:", error);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

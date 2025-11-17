import { NextResponse } from "next/server";
import sql from "@/lib/db";
import bcrypt from "bcrypt"; // 1. bcrypt 임포트
import { put } from "@vercel/blob"; // 2. @vercel/blob의 put 임포트

// 3. FormData를 사용하므로 interface 대신 FormData 필드에 접근합니다.
export async function POST(request: Request) {
  try {
    // 4. request.json() 대신 request.formData() 사용
    const formData = await request.formData();
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const profilePic = formData.get("profilePic") as File | null; // 프로필 사진 파일

    console.log("=== 회원가입 요청 ===");
    console.log("Username:", username);
    console.log("Name:", name);
    console.log("Profile Pic:", profilePic?.name || "없음");

    if (!username || !password || !name) {
      console.log("❌ 필드 누락");
      return NextResponse.json(
        { error: "모든 필드를 입력해주세요 (아이디, 비밀번호, 이름)" },
        { status: 400 }
      );
    }

    // 5. [보안] 비밀번호 해시 생성
    const hashedPassword = await bcrypt.hash(password, 10);

    let profilePicUrl: string | null = null;

    // 6. [Blob] 프로필 사진이 있으면 Vercel Blob에 업로드
    if (profilePic && profilePic.size > 0) {
      try {
        const filename = `${Date.now()}-${profilePic.name}`;
        const blob = await put(filename, profilePic, {
          access: "public",
        });
        profilePicUrl = blob.url; // 업로드된 URL을 저장
        console.log("✅ 프로필 사진 업로드 성공:", profilePicUrl);
      } catch (blobError) {
        console.error("❌ Blob 업로드 에러:", blobError);
        // 프로필 사진 업로드에 실패해도 회원가입은 진행되도록 처리 (선택적)
      }
    }

    // 7. [수정] 해시된 비밀번호와 Blob URL을 DB에 저장
    const result = await sql`
      INSERT INTO users (username, password, name, profile_pic)
      VALUES (${username}, ${hashedPassword}, ${name}, ${profilePicUrl})
      RETURNING id
    `;

    console.log("✅ 회원가입 성공!");
    console.log("새 사용자 ID:", result.rows[0].id);

    return NextResponse.json({
      message: "회원가입 성공",
      userId: result.rows[0].id,
      profilePicUrl: profilePicUrl,
    });
  } catch (error: unknown) {
    console.error("❌ 서버 에러:", error);

    if (error instanceof Error && error.message.includes("duplicate key")) {
      return NextResponse.json(
        { error: "이미 존재하는 사용자입니다" },
        { status: 400 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : "서버 오류";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

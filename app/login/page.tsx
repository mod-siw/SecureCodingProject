"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", password: "", name: "" });
  // 1. 프로필 사진 파일을 위한 state 추가
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      let res: Response;

      if (isLogin) {
        // === 로그인 로직 (JSON) ===
        const endpoint = "/api/auth/login";
        res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // 로그인 시에는 이름(name)이 필요 없습니다.
          body: JSON.stringify({
            username: form.username,
            password: form.password,
          }),
        });
      } else {
        // === 회원가입 로직 (FormData) ===
        const endpoint = "/api/auth/signup";
        // 2. FormData 생성
        const formData = new FormData();
        formData.append("username", form.username);
        formData.append("password", form.password);
        formData.append("name", form.name);
        if (file) {
          formData.append("profilePic", file); // 파일 추가
        }

        // 3. FormData 전송 (headers에 Content-Type을 지정하지 않음)
        res = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });
      }

      const data = await res.json();

      if (res.ok) {
        if (isLogin) {
          localStorage.setItem("user", JSON.stringify(data.user));
          router.push("/");
        } else {
          alert("회원가입 완료! 로그인해주세요.");
          setIsLogin(true); // 로그인 폼으로 전환
          // 폼 초기화
          setForm({ username: "", password: "", name: "" });
          setFile(null);
        }
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Auth error:", error);
      alert("요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg border border-gray-300 w-96">
        <h1 className="text-3xl font-bold text-center mb-6">InstaClone</h1>

        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="이름"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-3 border rounded mb-3"
            />
            {/* 4. 프로필 사진 업로드 UI 추가 */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              프로필 사진 (선택)
            </label>
            <input
              type="file"
              accept="image/*" // 이미지 파일만
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setFile(e.target.files[0]);
                }
              }}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-3"
            />
          </>
        )}

        <input
          type="text"
          placeholder="사용자 이름"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="w-full p-3 border rounded mb-3"
        />

        <input
          type="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-3 border rounded mb-4"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white p-3 rounded font-semibold"
        >
          {isLogin ? "로그인" : "가입하기"}
        </button>

        <p className="text-center mt-4 text-sm">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500"
          >
            {isLogin ? "계정이 없으신가요? 가입하기" : "로그인으로 돌아가기"}
          </button>
        </p>
      </div>
    </div>
  );
}

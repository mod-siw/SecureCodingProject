"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", password: "", name: "" });
  const router = useRouter();

  const handleSubmit = async () => {
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      if (isLogin) {
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/");
      } else {
        alert("회원가입 완료!");
        setIsLogin(true);
      }
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg border border-gray-300 w-96">
        <h1 className="text-3xl font-bold text-center mb-6">InstaClone</h1>

        {!isLogin && (
          <input
            type="text"
            placeholder="이름"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-3 border rounded mb-3"
          />
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

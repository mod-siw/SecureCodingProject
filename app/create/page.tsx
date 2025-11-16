"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { PlusSquare } from "lucide-react";

interface User {
  id: number;
  username: string;
  name: string;
}

export default function CreatePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/login");
    } else {
      setCurrentUser(JSON.parse(user) as User);
    }
  }, [router]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!imageFile || !currentUser) {
      alert("이미지를 선택해주세요.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("userId", String(currentUser.id));
    formData.append("image", imageFile);
    formData.append("caption", caption);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        router.push("/");
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (error) {
      alert("게시물 업로드 실패");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentUser={currentUser} onLogout={handleLogout} />

      <main className="max-w-2xl mx-auto py-4 sm:py-8 px-4">
        <div className="bg-white border-0 sm:border border-gray-300 sm:rounded-lg p-4 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8 text-center">
            새 게시물 만들기
          </h2>

          <div className="space-y-6">
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 sm:p-16 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <PlusSquare size={32} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-base sm:text-lg mb-2">
                      사진을 여기에 끌어다 놓으세요
                    </p>
                    <label
                      htmlFor="file-input"
                      className="inline-block bg-blue-500 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold text-sm hover:bg-blue-600 cursor-pointer transition"
                    >
                      컴퓨터에서 선택
                    </label>
                    <input
                      id="file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full rounded-lg mb-4"
                />
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="문구를 입력하세요..."
                  className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-gray-400"
                  rows={3}
                />
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => {
                      setImagePreview("");
                      setImageFile(null);
                      setCaption("");
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-300"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-blue-500 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50"
                  >
                    {loading ? "업로드중..." : "공유하기"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

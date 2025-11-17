"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { PlusSquare } from "lucide-react";
import { User, PostWithDetails } from "@/types/database";

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<PostWithDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/login");
    } else {
      const userData = JSON.parse(user) as User;
      setCurrentUser(userData);
      fetchUserPosts(userData.id);
    }
  }, [router]);

  // [수정] 현재 이 방식은 모든 게시물을 불러온 후 '필터링'합니다.
  // 게시물이 많아지면 매우 비효율적이 됩니다.
  // TODO: 추후 /api/users/[userId]/posts 같은 API를 만들어
  //       해당 사용자의 게시물만 DB에서 가져오도록 최적화하는 것이 좋습니다.
  const fetchUserPosts = async (userId: number): Promise<void> => {
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      const userPosts = data.posts.filter(
        (p: PostWithDetails) => p.user_id === userId
      );
      setPosts(userPosts);
    } catch (error) {
      console.error("게시물 로딩 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = (): void => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!currentUser || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">로딩중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentUser={currentUser} onLogout={handleLogout} />

      <main className="max-w-4xl mx-auto py-4 sm:py-8 px-0 sm:px-4">
        <div className="bg-white border-0 sm:border border-gray-300 sm:rounded-lg">
          <div className="p-4 sm:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-12">
            <div className="w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
              <div className="w-[76px] h-[76px] sm:w-[120px] sm:h-[120px] bg-white rounded-full flex items-center justify-center text-3xl sm:text-5xl font-semibold overflow-hidden">
                {currentUser.profile_pic ? (
                  // 프로필 사진이 있으면 <img> 렌더링
                  <img
                    src={currentUser.profile_pic}
                    alt={currentUser.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // 없으면 첫 글자 렌더링
                  currentUser.username[0].toUpperCase()
                )}
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left w-full">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-4">
                <h2 className="text-xl sm:text-2xl font-light">
                  {currentUser.username}
                </h2>
                <button className="px-6 py-1.5 bg-gray-100 rounded-lg font-semibold text-sm hover:bg-gray-200">
                  프로필 편집
                </button>
              </div>
              <div className="flex gap-6 sm:gap-10 justify-center sm:justify-start mb-4">
                <span className="text-sm">
                  게시물 <span className="font-semibold">{posts.length}</span>
                </span>
                <span className="text-sm">
                  팔로워 <span className="font-semibold">0</span>
                </span>
                <span className="text-sm">
                  팔로우 <span className="font-semibold">0</span>
                </span>
              </div>
              <p className="font-semibold text-sm">{currentUser.name}</p>
            </div>
          </div>

          <div className="border-t border-gray-300">
            <div className="flex justify-center py-3 border-b border-gray-300">
              <button className="px-4 py-1 font-semibold text-xs text-gray-600 border-t border-black -mt-3">
                게시물
              </button>
            </div>

            {/* 게시물 그리드 */}
            <div className="grid grid-cols-3 gap-0.5 sm:gap-1 p-0 sm:p-1">
              {posts.length === 0 ? (
                <div className="col-span-3 py-20 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 border-2 border-gray-300 rounded-full flex items-center justify-center">
                    <PlusSquare size={28} className="text-gray-300" />
                  </div>
                  <p className="text-gray-400">게시물 없음</p>
                </div>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="relative aspect-square">
                    <img
                      src={post.image_path}
                      alt="Post"
                      className="w-full h-full object-cover cursor-pointer hover:opacity-90"
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

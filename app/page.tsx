"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import PostCard from "@/components/PostCard";
import CommentModal from "@/components/CommentModal";
import { PlusSquare } from "lucide-react";
import { User, PostWithDetails } from "@/types/database";

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<PostWithDetails[]>([]);
  const [selectedPost, setSelectedPost] = useState<PostWithDetails | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/login");
    } else {
      setCurrentUser(JSON.parse(user) as User);
      fetchPosts();
    }
  }, [router]);

  const fetchPosts = async (): Promise<void> => {
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error("게시물 로딩 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: number): Promise<void> => {
    if (!currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("좋아요 에러:", errorData);
        alert(`좋아요 실패: ${errorData.error}`);
        return;
      }

      const data = await res.json();
      console.log("좋아요 성공:", data);

      // 게시물 목록 새로고침
      await fetchPosts();

      // 모달이 열려있으면 모달도 업데이트
      if (selectedPost) {
        const updated = posts.find((p) => p.id === postId);
        if (updated) setSelectedPost(updated);
      }
    } catch (error) {
      console.error("좋아요 실패:", error);
      alert("좋아요 처리 중 오류가 발생했습니다.");
    }
  };

  const handleComment = async (postId: number, text: string): Promise<void> => {
    if (!currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }

    const url = `/api/posts/${postId}/comments`;
    console.log("댓글 작성 요청:", {
      url,
      postId,
      userId: currentUser.id,
      text,
    });

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id, postId: postId, text }),
        credentials: "include",
      });

      console.log("댓글 응답 상태:", res.status, res.statusText);

      if (!res.ok) {
        const errorData = await res.json();
        console.error("댓글 작성 실패:", errorData);
        alert(`댓글 작성 실패: ${errorData.error}`);
        return;
      }

      const data = await res.json();
      console.log("댓글 작성 성공:", data);

      // 게시물 목록 새로고침
      await fetchPosts();

      // 모달이 열려있으면 모달도 업데이트
      if (selectedPost) {
        const updated = posts.find((p) => p.id === postId);
        if (updated) setSelectedPost(updated);
      }
    } catch (error) {
      console.error("댓글 작성 에러:", error);
      alert("댓글 작성 중 오류가 발생했습니다.");
    }
  };
  const handleDelete = async (postId: number): Promise<void> => {
    if (!currentUser) return;

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id }),
      });

      if (res.ok) {
        alert("게시물이 삭제되었습니다.");
        await fetchPosts();
        if (selectedPost?.id === postId) {
          setSelectedPost(null);
        }
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (error) {
      console.error("게시물 삭제 에러:", error);
      alert("게시물 삭제 중 오류가 발생했습니다.");
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

      <main className="max-w-2xl mx-auto py-4 sm:py-8 px-0 sm:px-4">
        <div className="space-y-4 sm:space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-4 border-4 border-black rounded-full flex items-center justify-center">
                <PlusSquare size={40} />
              </div>
              <h2 className="text-2xl font-light mb-2">게시물이 없습니다</h2>
              <p className="text-gray-500">첫 번째 게시물을 만들어보세요!</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={currentUser}
                onLike={handleLike}
                onComment={handleComment}
                onOpenModal={setSelectedPost}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </main>

      {selectedPost && (
        <CommentModal
          post={selectedPost}
          currentUser={currentUser}
          onClose={() => setSelectedPost(null)}
          onLike={handleLike}
          onComment={handleComment}
        />
      )}
    </div>
  );
}

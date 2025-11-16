"use client";
import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Smile,
} from "lucide-react";

export default function PostCard({
  post,
  currentUser,
  onLike,
  onComment,
  onOpenModal,
}) {
  const [commentText, setCommentText] = useState("");

  const handleComment = () => {
    if (commentText.trim()) {
      onComment(post.id, commentText, currentUser.id);
      setCommentText("");
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "방금 전";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}분 전`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}시간 전`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}일 전`;
    return new Date(date).toLocaleDateString("ko-KR");
  };

  return (
    <div className="bg-white border-0 sm:border border-gray-300 sm:rounded-lg">
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500 rounded-full flex items-center justify-center">
            <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-sm font-semibold">
              {post.username[0].toUpperCase()}
            </div>
          </div>
          <p className="font-semibold text-sm">{post.username}</p>
        </div>
        <button className="text-gray-600">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <img src={post.image_path} alt="Post" className="w-full" />

      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onLike(post.id)}
              className="hover:opacity-60 transition"
            >
              <Heart
                size={26}
                className={
                  post.likedBy?.includes(currentUser.id)
                    ? "fill-red-500 text-red-500"
                    : ""
                }
                strokeWidth={1.5}
              />
            </button>
            <button
              className="hover:opacity-60"
              onClick={() => onOpenModal(post)}
            >
              <MessageCircle size={26} strokeWidth={1.5} />
            </button>
            <button className="hover:opacity-60">
              <Send size={26} strokeWidth={1.5} />
            </button>
          </div>
          <button className="hover:opacity-60">
            <Bookmark size={26} strokeWidth={1.5} />
          </button>
        </div>

        {post.likes > 0 && (
          <p className="font-semibold text-sm mb-2">좋아요 {post.likes}개</p>
        )}

        {post.caption && (
          <p className="text-sm mb-1">
            <span className="font-semibold mr-2">{post.username}</span>
            {post.caption}
          </p>
        )}

        {post.comments && post.comments.length > 0 && (
          <div className="mt-2 space-y-2">
            {post.comments.length > 2 && (
              <button
                className="text-sm text-gray-500"
                onClick={() => onOpenModal(post)}
              >
                댓글 {post.comments.length}개 모두 보기
              </button>
            )}
            {post.comments.slice(-2).map((comment) => (
              <p key={comment.id} className="text-sm">
                <span className="font-semibold mr-2">{comment.username}</span>
                {comment.text}
              </p>
            ))}
          </div>
        )}

        <p className="text-xs text-gray-400 mt-2 uppercase">
          {getTimeAgo(post.created_at)}
        </p>
      </div>

      <div className="border-t border-gray-200 p-3 flex items-center gap-3">
        <button className="text-gray-400">
          <Smile size={24} />
        </button>
        <input
          type="text"
          placeholder="댓글 달기..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleComment()}
          className="flex-1 text-sm focus:outline-none"
        />
        {commentText && (
          <button
            onClick={handleComment}
            className="text-blue-500 font-semibold text-sm"
          >
            게시
          </button>
        )}
      </div>
    </div>
  );
}

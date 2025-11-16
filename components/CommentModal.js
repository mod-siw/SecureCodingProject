"use client";
import { useState } from "react";
import { X, Heart, MessageCircle, Send, Bookmark, Smile } from "lucide-react";

export default function CommentModal({
  post,
  currentUser,
  onClose,
  onLike,
  onComment,
}) {
  const [commentText, setCommentText] = useState("");

  const handleComment = () => {
    if (commentText.trim()) {
      onComment(post.id, commentText);
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
    <div
      className="fixed inset-0 bg-black z-30 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white opacity-100 rounded-lg max-w-5xl w-full max-h-[90vh] flex flex-col sm:flex-row overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full sm:w-1/2 bg-black opacity-100 flex items-center justify-center">
          <img
            src={post.image_path}
            alt="Post"
            className="w-full h-auto max-h-[50vh] sm:max-h-full object-contain"
          />
        </div>

        <div className="bg-white opacity-100 w-full sm:w-1/2 flex flex-col max-h-[50vh] sm:max-h-full">
          <div className="p-4 border-b border-gray-300 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500 rounded-full flex items-center justify-center">
                <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-sm font-semibold">
                  {post.username[0].toUpperCase()}
                </div>
              </div>
              <p className="font-semibold text-sm">{post.username}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {post.caption && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {post.username[0].toUpperCase()}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-semibold mr-2">{post.username}</span>
                    {post.caption}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {getTimeAgo(post.created_at)}
                  </p>
                </div>
              </div>
            )}

            {post.comments?.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                  {comment.username[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-semibold mr-2">
                      {comment.username}
                    </span>
                    {comment.text}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {getTimeAgo(comment.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-300">
            <div className="p-3 flex items-center gap-4">
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
              <button className="hover:opacity-60">
                <MessageCircle size={26} strokeWidth={1.5} />
              </button>
              <button className="hover:opacity-60">
                <Send size={26} strokeWidth={1.5} />
              </button>
              <button className="ml-auto hover:opacity-60">
                <Bookmark size={26} strokeWidth={1.5} />
              </button>
            </div>

            {post.likes > 0 && (
              <p className="px-3 pb-2 font-semibold text-sm">
                좋아요 {post.likes}개
              </p>
            )}

            <p className="px-3 pb-3 text-xs text-gray-400 uppercase">
              {getTimeAgo(post.created_at)}
            </p>

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
        </div>
      </div>
    </div>
  );
}

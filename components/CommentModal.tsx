"use client";
import { useState } from "react";
import { X, Heart, MessageCircle, Send, Bookmark, Smile } from "lucide-react";
import { User, PostWithDetails, Comment } from "@/types/database";

// 타입 정의
interface CommentModalProps {
  post: PostWithDetails;
  currentUser: User;
  onClose: () => void;
  onLike: (postId: number) => Promise<void>;
  onComment: (postId: number, text: string) => Promise<void>;
}

export default function CommentModal({
  post,
  currentUser,
  onClose,
  onLike,
  onComment,
}: CommentModalProps) {
  const [commentText, setCommentText] = useState("");

  const handleComment = () => {
    if (commentText.trim()) {
      onComment(post.id, commentText);
      setCommentText("");
    }
  };

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / 1000
    );
    if (seconds < 60) return "방금 전";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}분 전`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}시간 전`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}일 전`;
    return new Date(date).toLocaleDateString("ko-KR");
  };

  const renderProfilePic = (
    profilePic: string | null | undefined,
    username: string
  ) => {
    return (
      <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-sm font-semibold overflow-hidden">
        {profilePic ? (
          <img
            src={profilePic}
            alt={username}
            className="w-full h-full object-cover"
          />
        ) : (
          username[0].toUpperCase()
        )}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 z-30 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] flex flex-col sm:flex-row overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full sm:w-1/2 bg-black flex items-center justify-center">
          <img
            src={post.image_path}
            alt="Post"
            className="w-full h-auto max-h-[50vh] sm:max-h-full object-contain"
          />
        </div>

        {/*  댓글/정보 부분 */}
        <div className="bg-white w-full sm:w-1/2 flex flex-col max-h-[50vh] sm:max-h-full">
          {/* 헤더 */}
          <div className="p-4 border-b border-gray-300 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500 rounded-full flex items-center justify-center overflow-hidden">
                {renderProfilePic(post.profile_pic, post.username)}
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

          {/* 캡션 및 댓글 목록 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* 캡션 */}
            {post.caption && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {renderProfilePic(post.profile_pic, post.username)}
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

            {/* 댓글 목록 */}
            {post.comments?.map((comment: Comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {/* 댓글 작성자의 프로필 사진 렌더링 */}
                  {renderProfilePic(comment.profile_pic, comment.username)}
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

          {/* 하단 좋아요, 댓글 입력 부분 */}
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

            {/* 댓글 입력창 */}
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

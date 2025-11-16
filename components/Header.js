"use client";
import { useRouter } from "next/navigation";
import { Home, PlusSquare, User, LogOut, Search } from "lucide-react";

export default function Header({ currentUser, onLogout }) {
  const router = useRouter();

  return (
    <header className="bg-white border-b border-gray-300 sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2 flex items-center justify-between">
        <h1
          className="text-xl sm:text-2xl font-serif italic cursor-pointer"
          onClick={() => router.push("/")}
        >
          InstaClone
        </h1>

        <div className="flex-1 max-w-xs mx-4 sm:mx-8 hidden md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="검색"
              className="w-full pl-10 pr-4 py-1.5 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none"
            />
            <Search className="absolute left-3 top-2 text-gray-400" size={16} />
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <button onClick={() => router.push("/")}>
            <Home size={22} className="sm:w-6 sm:h-6" />
          </button>
          <button onClick={() => router.push("/create")}>
            <PlusSquare size={22} className="sm:w-6 sm:h-6" />
          </button>
          <button onClick={() => router.push("/profile")}>
            <User size={22} className="sm:w-6 sm:h-6" />
          </button>
          <button onClick={onLogout} className="hidden sm:block">
            <LogOut size={22} className="sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}

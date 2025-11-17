import { sql } from "@vercel/postgres";

// 테이블 초기화 함수
export async function initDatabase() {
  try {
    console.log("Database initialization started...");

    // 사용자 테이블 (users)
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        bio TEXT,
        profile_pic VARCHAR(500), -- 프로필 사진 URL (Blob URL)
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("  ✅ Table 'users' checked/created.");

    // 게시물 테이블 (posts)
    await sql`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        image_path VARCHAR(500) NOT NULL, -- 이미지 파일 URL (Blob URL)
        caption TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    console.log("  ✅ Table 'posts' checked/created.");

    // 좋아요 테이블 (likes)
    await sql`
      CREATE TABLE IF NOT EXISTS likes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        post_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        UNIQUE(user_id, post_id)
      )
    `;
    console.log("  ✅ Table 'likes' checked/created.");

    // 댓글 테이블 (comments)
    await sql`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        post_id INTEGER NOT NULL,
        text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
      )
    `;
    console.log("  ✅ Table 'comments' checked/created.");

    console.log("✅ Database tables initialization complete.");
  } catch (error) {
    console.error("❌ Database initialization error:", error);
  }
}

export default sql;

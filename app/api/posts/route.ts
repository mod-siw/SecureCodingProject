import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import db from "@/lib/db";
import { Post, Comment, Like, PostWithDetails } from "@/types/database";

export async function GET() {
  return new Promise<NextResponse>((resolve) => {
    const query = `
      SELECT 
        posts.*,
        users.username,
        users.name,
        users.profile_pic,
        COUNT(DISTINCT likes.id) as like_count
      FROM posts
      LEFT JOIN users ON posts.user_id = users.id
      LEFT JOIN likes ON posts.id = likes.post_id
      GROUP BY posts.id
      ORDER BY posts.created_at DESC
    `;

    db.all(query, [], async (err: Error | null, posts: Post[]) => {
      if (err) {
        console.error("게시물 조회 에러:", err);
        resolve(NextResponse.json({ error: err.message }, { status: 500 }));
        return;
      }

      console.log(`게시물 ${posts.length}개 조회됨`);

      const postsWithDetails = await Promise.all(
        posts.map((post) => {
          return new Promise<PostWithDetails>((res) => {
            db.all(
              `SELECT comments.*, users.username
               FROM comments
               JOIN users ON comments.user_id = users.id
               WHERE comments.post_id = ?
               ORDER BY comments.created_at ASC`,
              [post.id],
              (err: Error | null, comments: Comment[]) => {
                if (err) {
                  console.error(`게시물 ${post.id} 댓글 조회 에러:`, err);
                  res({ ...post, comments: [], likedBy: [], likes: 0 });
                  return;
                }

                console.log(`게시물 ${post.id}: 댓글 ${comments.length}개`);

                db.all(
                  "SELECT user_id FROM likes WHERE post_id = ?",
                  [post.id],
                  (err: Error | null, likes: Pick<Like, "user_id">[]) => {
                    if (err) {
                      console.error(`게시물 ${post.id} 좋아요 조회 에러:`, err);
                    }

                    res({
                      ...post,
                      comments: comments || [],
                      likedBy: likes ? likes.map((l) => l.user_id) : [],
                      likes: parseInt(String(post.like_count)) || 0,
                    });
                  }
                );
              }
            );
          });
        })
      );

      console.log("게시물 상세 정보 로딩 완료");
      resolve(NextResponse.json({ posts: postsWithDetails }));
    });
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const userId = formData.get("userId");
    const caption = formData.get("caption");
    const image = formData.get("image");

    if (!userId || !image || !(image instanceof File)) {
      return NextResponse.json(
        { error: "필수 정보가 누락되었습니다" },
        { status: 400 }
      );
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${image.name}`;
    const filepath = path.join(process.cwd(), "public", "uploads", filename);

    await writeFile(filepath, buffer);

    return new Promise<NextResponse>((resolve) => {
      db.run(
        "INSERT INTO posts (user_id, image_path, caption) VALUES (?, ?, ?)",
        [userId, `/uploads/${filename}`, caption || null],
        function (this: { lastID: number }, err: Error | null) {
          if (err) {
            resolve(
              NextResponse.json(
                { error: "게시물 업로드 실패" },
                { status: 500 }
              )
            );
          } else {
            resolve(
              NextResponse.json({
                message: "게시물 업로드 성공",
                postId: this.lastID,
                imagePath: `/uploads/${filename}`,
              })
            );
          }
        }
      );
    });
  } catch (error) {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

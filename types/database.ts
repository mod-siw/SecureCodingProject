export interface User {
  id: number;
  username: string;
  name: string;
  bio?: string;
  profile_pic?: string;
  created_at: string;
}

export interface Post {
  id: number;
  user_id: number;
  username: string;
  name: string;
  profile_pic?: string;
  image_path: string;
  caption?: string;
  like_count: number;
  created_at: string;
}

export interface Comment {
  id: number;
  user_id: number;
  post_id: number;
  username: string;
  text: string;
  created_at: string;
  profile_pic: string | null;
}

export interface Like {
  id: number;
  user_id: number;
  post_id: number;
  created_at: string;
}

export interface PostWithDetails extends Post {
  likes: number;
  likedBy: number[];
  comments: Comment[];
}

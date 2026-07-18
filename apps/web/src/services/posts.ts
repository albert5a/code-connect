import { AxiosError } from "axios";
import { apiClient } from "./apiClient";
import { getAuthToken } from "./auth";

export type PostAuthor = {
  id: string;
  name: string;
};

export type PostComment = {
  id: string;
  content: string;
  author: PostAuthor;
  createdAt: string;
  updatedAt: string;
};

export type Post = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnailUrl: string | null;
  tags: string[];
  author: PostAuthor;
  likesCount: number;
  commentsCount: number;
  likedByCurrentUser: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PostDetails = Post & {
  comments: PostComment[];
};

export type CreatePostPayload = {
  title: string;
  excerpt: string;
  content: string;
  thumbnailUrl?: string;
  tags?: string[];
};

type ApiErrorResponse = {
  message?: string | string[];
};

function authHeaders() {
  const token = getAuthToken();

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : undefined;
}

export async function listPosts(search?: string) {
  const { data } = await apiClient.get<Post[]>("/posts", {
    params: search ? { search } : undefined,
    headers: authHeaders(),
  });

  return data;
}

export async function getPost(id: string) {
  const { data } = await apiClient.get<PostDetails>(`/posts/${id}`, {
    headers: authHeaders(),
  });

  return data;
}

export async function createPost(payload: CreatePostPayload) {
  const { data } = await apiClient.post<Post>("/posts", payload, {
    headers: authHeaders(),
  });

  return data;
}

export async function likePost(id: string) {
  const { data } = await apiClient.post<PostDetails>(
    `/posts/${id}/likes`,
    {},
    {
      headers: authHeaders(),
    },
  );

  return data;
}

export async function unlikePost(id: string) {
  const { data } = await apiClient.delete<PostDetails>(`/posts/${id}/likes`, {
    headers: authHeaders(),
  });

  return data;
}

export async function commentPost(id: string, content: string) {
  const { data } = await apiClient.post<PostComment>(
    `/posts/${id}/comments`,
    { content },
    {
      headers: authHeaders(),
    },
  );

  return data;
}

export function getPostErrorMessage(error: unknown, fallback: string) {
  if (error instanceof AxiosError) {
    const apiMessage = (error.response?.data as ApiErrorResponse | undefined)
      ?.message;

    if (Array.isArray(apiMessage)) {
      return apiMessage.join(" ");
    }

    if (typeof apiMessage === "string") {
      return apiMessage;
    }

    if (error.response?.status === 401) {
      return "Faça login para continuar.";
    }

    if (!error.response) {
      return "Não foi possível conectar à API. Tente novamente em instantes.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

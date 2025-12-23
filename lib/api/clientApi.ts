import type { User } from "@/types/user";
import type { Note } from "@/types/note";
import { api } from "./api";

// ===== Notes =====
export interface FetchNotesParams {
  search?: string;
  page?: number;
  perPage?: number; // але ми все одно будемо передавати 12
  tag?: string;
}

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes(
  params: FetchNotesParams
): Promise<NotesResponse> {
  const queryParams: Record<string, string | number> = {
    perPage: 12,
  };

  if (typeof params.page === "number") queryParams.page = params.page;
  if (params.search !== undefined) queryParams.search = params.search;

  // ✅ tag додаємо тільки якщо він НЕ порожній і НЕ "all"
  if (params.tag && params.tag !== "all") {
    queryParams.tag = params.tag;
  }

  const { data } = await api.get<NotesResponse>("/notes", {
    params: queryParams,
  });

  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  tag: string;
}

export async function createNote(payload: CreateNoteRequest): Promise<Note> {
  const { data } = await api.post<Note>("/notes", payload);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}

// ===== Auth =====
export interface AuthRequest {
  email: string;
  password: string;
}

export async function register(payload: AuthRequest): Promise<User> {
  const { data } = await api.post<User>("/auth/register", payload);
  return data;
}

export async function login(payload: AuthRequest): Promise<User> {
  const { data } = await api.post<User>("/auth/login", payload);
  return data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function checkSession(): Promise<User | null> {
  try {
    const { data } = await api.get<User | null>("/auth/session");
    // бекенд може повернути або user, або null/порожнє тіло — тут безпечно
    return data ?? null;
  } catch {
    return null;
  }
}

// ===== Users =====
export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/users/me");
  return data;
}

export interface UpdateMeRequest {
  username: string;
}

export async function updateMe(payload: UpdateMeRequest): Promise<User> {
  const { data } = await api.patch<User>("/users/me", payload);
  return data;
}

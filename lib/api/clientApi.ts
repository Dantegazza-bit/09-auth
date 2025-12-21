import axios from "axios";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";

// ✅ клієнтський інстанс саме для Next route handlers (/api/*)
const client = axios.create({
  baseURL: "", // same-origin (localhost / vercel)
  withCredentials: true,
});

// ===== Notes =====
export interface FetchNotesParams {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: string;
}

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes(
  params: FetchNotesParams
): Promise<NotesResponse> {
  const { data } = await client.get<NotesResponse>("/api/notes", {
    params: { perPage: 12, ...params },
  });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await client.get<Note>(`/api/notes/${id}`);
  return data;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  tag: string;
}

export async function createNote(payload: CreateNoteRequest): Promise<Note> {
  const { data } = await client.post<Note>("/api/notes", payload);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await client.delete<Note>(`/api/notes/${id}`);
  return data;
}

// ===== Auth =====
export interface AuthRequest {
  email: string;
  password: string;
}

export async function register(payload: AuthRequest): Promise<User> {
  const { data } = await client.post<User>("/api/auth/register", payload);
  return data;
}

export async function login(payload: AuthRequest): Promise<User> {
  const { data } = await client.post<User>("/api/auth/login", payload);
  return data;
}

export async function logout(): Promise<void> {
  await client.post("/api/auth/logout");
}

export async function checkSession(): Promise<User | null> {
  try {
    const { data } = await client.get<{ success: boolean; user: User }>(
      "/api/auth/session"
    );
    return data.success ? data.user : null;
  } catch {
    return null;
  }
}

// ===== Users =====
export async function getMe(): Promise<User> {
  const { data } = await client.get<User>("/api/users/me");
  return data;
}

export interface UpdateMeRequest {
  username: string;
}

export async function updateMe(payload: UpdateMeRequest): Promise<User> {
  const { data } = await client.patch<User>("/api/users/me", payload);
  return data;
}

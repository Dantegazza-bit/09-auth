import axios from "axios";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

import type { User } from "@/types/user";
import type { Note } from "@/types/note";
import type { NotesResponse, FetchNotesParams } from "./clientApi";

function createServerApi(cookieHeader: string) {
  const origin = process.env.NEXT_PUBLIC_API_URL || "";
  const baseURL = `${origin}/api`;

  return axios.create({
    baseURL,
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
    withCredentials: true,
  });
}

function cookieStoreToHeader(cookieStore: ReadonlyRequestCookies) {
  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}

// ✅ 1) Сесія = тільки success true/false
export async function serverCheckSession(
  cookieStore: ReadonlyRequestCookies
): Promise<boolean> {
  try {
    const api = createServerApi(cookieStoreToHeader(cookieStore));
    const { data } = await api.get<{ success: boolean }>("/auth/session");
    return Boolean(data?.success);
  } catch {
    return false;
  }
}

// ✅ 2) Дані юзера беремо окремо
export async function serverGetMe(
  cookieStore: ReadonlyRequestCookies
): Promise<User | null> {
  try {
    const api = createServerApi(cookieStoreToHeader(cookieStore));
    const { data } = await api.get<User>("/users/me");
    return data ?? null;
  } catch {
    return null;
  }
}

// ===== Notes (як було) =====
export async function serverFetchNotes(
  cookieStore: ReadonlyRequestCookies,
  params: FetchNotesParams
): Promise<NotesResponse> {
  const api = createServerApi(cookieStoreToHeader(cookieStore));
  const { data } = await api.get<NotesResponse>("/notes", {
    params: { perPage: 12, ...params },
  });
  return data;
}

export async function serverFetchNoteById(
  cookieStore: ReadonlyRequestCookies,
  id: string
): Promise<Note> {
  const api = createServerApi(cookieStoreToHeader(cookieStore));
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

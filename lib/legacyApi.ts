import axios from "axios";
import type { Note, CreateNotePayload } from "@/types/note";

const API_BASE_URL = "https://notehub-public.goit.study/api";

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN?.trim();

if (!token) {
  console.warn("NEXT_PUBLIC_NOTEHUB_TOKEN is not set");
}

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  },
});

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes(
  params: FetchNotesParams
): Promise<FetchNotesResponse> {
  const { page, perPage, search = "", tag } = params;

  const res = await client.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage,
      search,
      ...(tag ? { tag } : {}),
    },
  });

  return res.data;
}

export async function createNote(payload: CreateNotePayload): Promise<Note> {
  const res = await client.post<Note>("/notes", payload);
  return res.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const res = await client.delete<Note>(`/notes/${id}`);
  return res.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const res = await client.get<Note>(`/notes/${id}`);
  return res.data;
}

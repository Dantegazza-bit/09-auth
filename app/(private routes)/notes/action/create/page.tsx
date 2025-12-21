// app/notes/action/create/page.tsx
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./CreateNote.module.css";
import type { Metadata } from "next";

const siteUrl = "http://localhost:3000";

export const metadata: Metadata = {
  title: "Create note | NoteHub",
  description: "Create a new note in NoteHub.",
  openGraph: {
    title: "Create note | NoteHub",
    description: "Create a new note in NoteHub.",
    url: `${siteUrl}/notes/action/create`,
    images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
  },
};

export default function CreateNotePage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}

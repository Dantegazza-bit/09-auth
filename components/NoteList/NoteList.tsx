"use client";

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { Note } from "@/types/note";
import { deleteNote } from "@/lib/api/clientApi";

import css from "./NoteList.module.css";

export interface NoteListProps {
  notes: Note[];
  detailsBasePath?: string;
}

export default function NoteList({
  notes,
  detailsBasePath = "/notes",
}: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note deleted");
    },
    onError: () => {
      toast.error("Failed to delete note");
    },
  });

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>

          <p className={css.content}>{note.content}</p>

          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>

            <div>
              <Link href={`${detailsBasePath}/${note.id}`} className={css.link}>
                View details
              </Link>

              <button
                type="button"
                className={css.button}
                onClick={() => deleteMutation.mutate(note.id)}
                disabled={deleteMutation.isPending}
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

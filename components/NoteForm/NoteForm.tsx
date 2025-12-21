"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { CreateNotePayload, NoteTag } from "@/types/note";
import { createNote } from "@/lib/api/clientApi";
import { useNoteStore, initialDraft } from "@/lib/store/noteStore";

import css from "./NoteForm.module.css";

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const draft = useNoteStore((state) => state.draft);
  const setDraft = useNoteStore((state) => state.setDraft);
  const clearDraft = useNoteStore((state) => state.clearDraft);

  const [form, setForm] = useState<CreateNotePayload>(
    () => draft ?? initialDraft
  );

  const createMutation = useMutation({
    mutationFn: (payload: CreateNotePayload) => createNote(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note created");
      clearDraft();
      router.back();
    },
    onError: () => {
      toast.error("Failed to create note");
    },
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    const next = {
      ...form,
      [name]: value,
    } as CreateNotePayload;

    setForm(next);
    setDraft(next);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const title = form.title.trim();
    if (title.length < 3 || title.length > 50) {
      toast.error("Title must be 3-50 characters");
      return;
    }

    if (form.content.trim().length > 500) {
      toast.error("Content must be at most 500 characters");
      return;
    }

    createMutation.mutate({
      ...form,
      title,
      content: form.content.trim(),
    });
  };

  const handleCancel = () => {
    router.back(); // draft НЕ чистимо
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <label className={css.formGroup}>
        <span>Title</span>
        <input
          name="title"
          className={css.input}
          value={form.title}
          onChange={handleChange}
          required
        />
      </label>

      <label className={css.formGroup}>
        <span>Content</span>
        <textarea
          name="content"
          className={`${css.input} ${css.textarea}`}
          value={form.content}
          onChange={handleChange}
        />
      </label>

      <label className={css.formGroup}>
        <span>Tag</span>
        <select
          name="tag"
          className={css.select}
          value={form.tag as NoteTag}
          onChange={handleChange}
          required
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Shopping">Shopping</option>
          <option value="Meeting">Meeting</option>
        </select>
      </label>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
          disabled={createMutation.isPending}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={css.submitButton}
          disabled={createMutation.isPending}
        >
          Create note
        </button>
      </div>
    </form>
  );
}

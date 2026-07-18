"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { FieldError, fieldErrorClass } from "@/components/ui/field-error";
import { Textarea } from "@/components/ui/textarea";
import { submitReviewAction } from "@/features/reviews/actions";
import type { RecoverableActionState } from "@/lib/forms/action-state";

const initialState: RecoverableActionState = { status: "idle" };
const selectClass = "h-11 w-full rounded-[10px] border border-border bg-surface px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10";
const ratingFields = [["Overall", "overallRating"], ["Communication", "communicationRating"], ["Quality", "qualityRating"], ["Delivery", "deliveryRating"], ["Value", "valueRating"]] as const;

export function ReviewForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(submitReviewAction, initialState);
  const [comment, setComment] = useState("");
  const commentError = state.errors?.comment?.[0];
  const message = state.message;

  return <form action={action} className="mt-8 grid gap-5 sm:grid-cols-2">
    <input type="hidden" name="token" value={token} />
    {ratingFields.map(([label, name]) => <label key={name}><span className="mb-2 block text-sm font-semibold">{label}</span><select name={name} defaultValue="5" className={selectClass}>{[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} / 5</option>)}</select></label>)}
    <label className="sm:col-span-2"><span className="mb-2 block text-sm font-semibold">Review</span><Textarea name="comment" value={comment} onChange={(event) => setComment(event.target.value)} required minLength={20} maxLength={5000} aria-invalid={Boolean(commentError)} aria-describedby="review-comment-hint review-comment-error" placeholder="Share what went well and what could be improved." className={fieldErrorClass(commentError)} /><span id="review-comment-hint" className="mt-2 block text-xs text-secondary">Minimum 20 characters · {comment.trim().length}/5000</span><FieldError id="review-comment-error" error={commentError} /></label>
    {message && <p role="alert" className="rounded-[10px] bg-[#fbe8e8] px-4 py-3 text-sm text-error sm:col-span-2">{message}</p>}
    <Button className="sm:col-span-2" disabled={pending}>{pending ? "Submitting…" : "Submit Verified Review"}</Button>
  </form>;
}

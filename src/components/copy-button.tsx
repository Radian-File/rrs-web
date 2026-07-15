"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CopyButton({ value, label = "Copy link", copiedLabel = "Copied" }: { value: string; label?: string; copiedLabel?: string }) {
  const [copied, setCopied] = useState(false);
  return <Button type="button" size="sm" variant="outline" onClick={async()=>{await navigator.clipboard.writeText(value);setCopied(true);window.setTimeout(()=>setCopied(false),2000)}} aria-live="polite">{copied?<Check className="size-4"/>:<Copy className="size-4"/>}{copied?copiedLabel:label}</Button>;
}

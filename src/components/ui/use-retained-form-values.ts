"use client";

import { useEffect, useRef } from "react";

type RetainedValue = { value: string; checked?: boolean };

export function useRetainedFormValues(formRef: React.RefObject<HTMLFormElement | null>, shouldRestore: boolean, excludedNames: string[] = []) {
  const valuesRef = useRef<Record<string, RetainedValue>>({});
  const excluded = useRef(new Set(excludedNames));

  const capture = () => {
    const form = formRef.current;
    if (!form) return;
    const next: Record<string, RetainedValue> = {};
    for (const element of Array.from(form.elements)) {
      if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) || !element.name || excluded.current.has(element.name) || element.type === "file") continue;
      next[element.name] = element instanceof HTMLInputElement && element.type === "checkbox" ? { value: element.value, checked: element.checked } : { value: element.value };
    }
    valuesRef.current = next;
  };

  useEffect(() => {
    if (!shouldRestore || !formRef.current) return;
    const frame = requestAnimationFrame(() => {
      for (const [name, saved] of Object.entries(valuesRef.current)) {
        const element = formRef.current?.elements.namedItem(name);
        const controls = element instanceof RadioNodeList ? Array.from(element) : [element];
        controls.forEach((control) => {
          if (control instanceof HTMLInputElement && control.type === "checkbox") control.checked = Boolean(saved.checked);
          else if (control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement || control instanceof HTMLSelectElement) control.value = saved.value;
        });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [formRef, shouldRestore]);

  return { capture };
}

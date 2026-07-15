"use client";
import { useState } from "react";
import { Archive } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BulkArchiveControls({ allCount, entity }: { allCount: number; entity: string }) {
 const [selected, setSelected] = useState(0);
 const selectAll = (checked: boolean) => { document.querySelectorAll<HTMLInputElement>('input[name="recordId"]').forEach((input) => input.checked = checked); setSelected(checked ? document.querySelectorAll('input[name="recordId"]').length : 0); };
 const submit = (mode: "selected"|"all") => { const form=document.querySelector<HTMLFormElement>("#bulk-archive-form"); if (!form) return; const count=mode==="all"?allCount:selected; if (!count || !window.confirm(`Archive ${count} ${entity}? This only hides them from the active list.`)) return; const input=document.createElement("input"); input.type="hidden"; input.name="mode"; input.value=mode; form.append(input); form.requestSubmit(); };
 return <div className="flex flex-wrap items-center gap-3"><label className="inline-flex items-center gap-2 text-sm font-semibold"><input type="checkbox" aria-label="Select all visible records" onChange={(event)=>selectAll(event.target.checked)}/> Select visible</label><Button type="button" variant="outline" size="sm" onClick={()=>submit("selected")} disabled={!selected}><Archive className="size-4"/>Archive selected ({selected})</Button><Button type="button" variant="danger" size="sm" onClick={()=>submit("all")} disabled={!allCount}><Archive className="size-4"/>Archive all ({allCount})</Button><input type="hidden" name="selectionChange" onChange={()=>setSelected(document.querySelectorAll<HTMLInputElement>('input[name="recordId"]:checked').length)}/></div>;
}
export function RecordCheckbox({ id }: { id:string }) { return <input type="checkbox" name="recordId" value={id} aria-label="Select record" onChange={()=>document.querySelector<HTMLInputElement>('input[name="selectionChange"]')?.dispatchEvent(new Event("change", {bubbles:true}))}/>; }

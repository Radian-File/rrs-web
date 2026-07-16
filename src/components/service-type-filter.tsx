"use client";
import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown, Globe } from "lucide-react";
import { useRouter } from "next/navigation";

export function ServiceTypeFilter({ types, value, query, label, allLabel }: { types: { slug: string; name: string; count: number }[]; value?: string; query?: string; label: string; allLabel: string }) {
 const router=useRouter(); const change=(next:string)=>{const p=new URLSearchParams();if(query)p.set("q",query);if(next)p.set("type",next);router.push(`/services${p.size?`?${p}`:""}`)};
 return <Select.Root value={value??"all"} onValueChange={(v)=>change(v==="all"?"":v)}><Select.Trigger aria-label={label} className="flex h-14 w-full items-center justify-between rounded-[12px] border border-border bg-surface px-4 text-sm font-semibold outline-none transition focus:ring-2 focus:ring-primary/10 sm:w-60"><span className="flex items-center gap-2"><Globe className="size-4 text-primary"/><Select.Value/></span><ChevronDown className="size-4 text-secondary"/></Select.Trigger><Select.Portal><Select.Content position="popper" sideOffset={8} className="z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-[14px] border border-border bg-surface p-1 shadow-xl"><Select.Viewport><Item value="all" label={allLabel} count={types.reduce((n,t)=>n+t.count,0)}/>{types.map(t=><Item key={t.slug} value={t.slug} label={t.name} count={t.count}/>)}</Select.Viewport></Select.Content></Select.Portal></Select.Root>;
}
function Item({value,label,count}:{value:string;label:string;count:number}){return <Select.Item value={value} className="relative flex cursor-pointer items-center justify-between rounded-[10px] py-2.5 pl-8 pr-3 text-sm outline-none data-[highlighted]:bg-accent-soft"><Select.ItemText>{label}</Select.ItemText><span className="text-xs text-secondary">{count}</span><Select.ItemIndicator className="absolute left-3"><Check className="size-3 text-primary"/></Select.ItemIndicator></Select.Item>}

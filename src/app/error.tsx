"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
export default function ErrorPage({error,reset}:{error:Error&{digest?:string};reset:()=>void}){useEffect(()=>{console.error("RRS route error",{digest:error.digest})},[error]);return <main className="grid min-h-[70vh] place-items-center px-5"><div className="max-w-lg text-center"><p className="text-sm font-bold uppercase tracking-[.14em] text-error">Error</p><h1 className="mt-3 font-display text-3xl font-extrabold">Terjadi kesalahan / Something went wrong</h1><p className="mt-4 leading-7 text-secondary">Konten tidak dapat dimuat dengan aman. The content could not be loaded safely.</p><Button className="mt-7" onClick={reset}>Coba lagi / Try again</Button></div></main>}

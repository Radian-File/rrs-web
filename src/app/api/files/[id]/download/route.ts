import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getServerEnv } from "@/lib/env";
import { prisma } from "@/lib/db/prisma";

export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){const session=await auth();if(!session?.user)return new NextResponse("Unauthorized",{status:401});const {id}=await params;const file=await prisma.fileAsset.findUnique({where:{id},include:{project:{select:{clientId:true}},inquiry:{select:{id:true}},paymentAttempt:{select:{clientId:true}}}});if(!file)return new NextResponse("Not found",{status:404});const owner=session.user.role==="OWNER";const authorized=owner||file.project?.clientId===session.user.id||file.paymentAttempt?.clientId===session.user.id;if(!authorized)return new NextResponse("Forbidden",{status:403});const root=path.resolve(getServerEnv().LOCAL_UPLOAD_DIR);const location=path.resolve(root,file.storageKey);if(!location.startsWith(root+path.sep))return new NextResponse("Invalid file",{status:400});try{const data=await readFile(location);return new NextResponse(data,{headers:{"Content-Type":file.mimeType,"Content-Disposition":`attachment; filename*=UTF-8''${encodeURIComponent(file.originalName)}`,"Cache-Control":"private, no-store"}})}catch{return new NextResponse("File unavailable",{status:404})}}

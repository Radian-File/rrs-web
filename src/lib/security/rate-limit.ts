import { createHash } from "node:crypto";
import { headers } from "next/headers";

type Bucket={count:number;resetAt:number};
const globalBuckets=globalThis as unknown as {rrsRateLimit?:Map<string,Bucket>};
const buckets=globalBuckets.rrsRateLimit??new Map<string,Bucket>();
if(process.env.NODE_ENV!=="production")globalBuckets.rrsRateLimit=buckets;

export class RateLimitError extends Error{constructor(public retryAfterSeconds:number){super("Too many requests. Please try again later.");this.name="RateLimitError"}}
export function consumeRateLimit(key:string,limit:number,windowMs:number,now=Date.now()){const current=buckets.get(key);if(!current||current.resetAt<=now){buckets.set(key,{count:1,resetAt:now+windowMs});return {remaining:limit-1,resetAt:now+windowMs}}if(current.count>=limit)throw new RateLimitError(Math.max(1,Math.ceil((current.resetAt-now)/1000)));current.count+=1;return{remaining:limit-current.count,resetAt:current.resetAt}}
export async function assertRequestRateLimit(scope:string,limit:number,windowMs:number,identity="anonymous"){const requestHeaders=await headers();const forwarded=requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();const ip=forwarded||requestHeaders.get("x-real-ip")||"local";const fingerprint=createHash("sha256").update(`${scope}:${ip}:${identity.toLowerCase()}`).digest("hex");return consumeRateLimit(fingerprint,limit,windowMs)}
export function resetRateLimitsForTests(){buckets.clear()}

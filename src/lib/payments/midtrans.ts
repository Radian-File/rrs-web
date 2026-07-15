import { createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { getServerEnv } from "@/lib/env";

const snapResponseSchema=z.object({token:z.string(),redirect_url:z.string().url()});
export type SnapRequest={orderId:string;grossAmount:number;customer:{firstName:string;email:string;phone?:string};item:{id:string;name:string;price:number;quantity:number}};
export async function createSnapTransaction(input:SnapRequest){const env=getServerEnv();if(!env.MIDTRANS_SERVER_KEY)throw new Error("Midtrans Sandbox server key is not configured.");if(env.MIDTRANS_IS_PRODUCTION)throw new Error("Production Midtrans is disabled before Phase 16.");const response=await fetch("https://app.sandbox.midtrans.com/snap/v1/transactions",{method:"POST",headers:{Authorization:`Basic ${Buffer.from(`${env.MIDTRANS_SERVER_KEY}:`).toString("base64")}`,"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify({transaction_details:{order_id:input.orderId,gross_amount:input.grossAmount},customer_details:{first_name:input.customer.firstName,email:input.customer.email,phone:input.customer.phone},item_details:[input.item]}),cache:"no-store"});const body=await response.json().catch(()=>null);if(!response.ok)throw new Error(`Midtrans Snap request failed with status ${response.status}.`);return snapResponseSchema.parse(body)}

export function midtransSignature(orderId:string,statusCode:string,grossAmount:string,serverKey:string){return createHash("sha512").update(`${orderId}${statusCode}${grossAmount}${serverKey}`).digest("hex")}
export function verifyMidtransSignature(input:{orderId:string;statusCode:string;grossAmount:string;signatureKey:string;serverKey:string}){const actual=Buffer.from(midtransSignature(input.orderId,input.statusCode,input.grossAmount,input.serverKey),"hex");const expected=Buffer.from(input.signatureKey,"hex");return actual.length===expected.length&&timingSafeEqual(actual,expected)}

export const midtransNotificationSchema=z.object({transaction_time:z.string().optional(),transaction_status:z.string(),transaction_id:z.string().optional(),status_message:z.string().optional(),status_code:z.string(),signature_key:z.string(),payment_type:z.string().optional(),order_id:z.string(),merchant_id:z.string().optional(),gross_amount:z.string(),fraud_status:z.string().optional()}).passthrough();

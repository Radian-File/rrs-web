import { getServerEnv } from "@/lib/env";
export type EmailMessage={to:string;subject:string;text:string};
export interface EmailProvider{send(message:EmailMessage):Promise<void>}
class ConsoleEmailProvider implements EmailProvider{async send(message:EmailMessage){console.info("[email:console]",{to:message.to,subject:message.subject})}}
class SesPlaceholderProvider implements EmailProvider{async send(){throw new Error("SES activation is deferred to Phase 16.")}}
export function getEmailProvider():EmailProvider{return getServerEnv().EMAIL_DRIVER==="ses"?new SesPlaceholderProvider():new ConsoleEmailProvider()}

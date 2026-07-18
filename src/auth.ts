import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";

const credentialsSchema = z.object({
  email: z.string().email().transform((value) => value.toLowerCase()),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user?.passwordHash) return null;
        const valid = await compare(parsed.data.password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  events: {
    async signIn({ user }) {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "LOGIN_SUCCESS",
          entityType: "User",
          entityId: user.id,
        },
      });
    },
  },
  callbacks: {
    authorized({ auth: session, request }) {
      const pathname = request.nextUrl.pathname;
      const role = session?.user?.role;
      const isOwnerRoute = pathname.startsWith("/owner");
      const isClientRoute = pathname.startsWith("/client");
      const isAuthRoute = pathname === "/login" || pathname === "/register";

      if (isOwnerRoute) {
        if (!session?.user) return false;
        if (role !== "OWNER") {
          return Response.redirect(new URL("/client", request.nextUrl));
        }
      }

      if (isClientRoute) {
        if (!session?.user) return false;
        if (role !== "CLIENT") {
          return Response.redirect(new URL("/owner", request.nextUrl));
        }
      }

      if (isAuthRoute && session?.user) {
        const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
        const destination = callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//")
          ? callbackUrl
          : role === "OWNER" ? "/owner" : "/client";
        return Response.redirect(new URL(destination, request.nextUrl));
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      const role = token.role;
      if (
        session.user &&
        typeof token.id === "string" &&
        (role === "OWNER" || role === "CLIENT")
      ) {
        session.user.id = token.id;
        session.user.role = role;
      }
      return session;
    },
  },
});

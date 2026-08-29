import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const CredentialsSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  trustHost: true,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // allow any Google account; Gmail is Google’s email anyway
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        identifier: { label: "Mail or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        const parsed = CredentialsSchema.safeParse(creds);
        if (!parsed.success) return null;
        const { identifier, password } = parsed.data;
        const idLower = identifier.toLowerCase().trim();
        const found = await prisma.user.findFirst({
          where: { OR: [{ email: idLower }, { username: idLower }] },
        });
        if (!found || !found.password) return null;
        const ok = await bcrypt.compare(password, found.password);
        if (!ok) return null;
        return { id: found.id, email: found.email!, name: found.name ?? found.username ?? null, image: found.image ?? null };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id: string }).id;
        const dbUser = await prisma.user.findUnique({
          where: { id: (user as { id: string }).id },
          select: { subscriptionTier: true, username: true },
        });
        (token as unknown as Record<string, unknown>).tier = dbUser?.subscriptionTier ?? "free";
        (token as unknown as Record<string, unknown>).username = dbUser?.username ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
        (session.user as unknown as Record<string, unknown>).id = token.id;
        (session.user as unknown as Record<string, unknown>).tier = (token as unknown as Record<string, unknown>).tier ?? "free";
        (session.user as unknown as Record<string, unknown>).username = (token as unknown as Record<string, unknown>).username ?? null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

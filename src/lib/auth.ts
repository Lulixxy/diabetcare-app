import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/src/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: "A_VERY_LONG_RANDOM_STRING_HERE_32_CHARS", 
  providers: [
    Credentials({
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user || !user.password) return null;
        const isMatch = await bcrypt.compare(credentials.password as string, user.password);
        return isMatch ? user : null;
      },
    }),
  ],
})
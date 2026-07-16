'use server'
import { prisma } from "@/src/lib/prisma";
import bcrypt from "bcryptjs";

export async function registerUserAction(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  await prisma.user.create({
    data: { email, password: hashedPassword, name },
  });
  
  return { success: true };
}
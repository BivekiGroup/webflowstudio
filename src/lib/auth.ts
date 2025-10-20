"use server";

import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE_NAME = "wfs_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days in seconds

export type PublicUser = {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
};

type InternalUserShape = PublicUser & {
  passwordHash?: string | null;
};

function sanitizeUser(user: InternalUserShape): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
}

async function createSession(userId: string) {
  const sessionId = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);

  await prisma.session.create({
    data: {
      id: sessionId,
      userId,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
    priority: "high",
  });
}

async function destroySession(sessionId: string) {
  await prisma.session.deleteMany({ where: { id: sessionId } });
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function registerUser(input: {
  email: string;
  password: string;
  name?: string;
}): Promise<{ success: true; user: PublicUser } | { success: false; error: string }> {
  const email = input.email.trim().toLowerCase();
  const name = input.name?.trim() ?? null;
  const password = input.password;

  if (!email || !password) {
    return { success: false, error: "Введите почту и пароль." };
  }

  if (!email.includes("@")) {
    return { success: false, error: "Похоже, что email указан неверно." };
  }

  if (password.length < 8) {
    return { success: false, error: "Пароль должен содержать минимум 8 символов." };
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { success: false, error: "Пользователь с такой почтой уже существует." };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
    },
  });

  await createSession(user.id);

  return { success: true, user: sanitizeUser(user) };
}

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<{ success: true; user: PublicUser } | { success: false; error: string }> {
  const email = input.email.trim().toLowerCase();
  const password = input.password;

  if (!email || !password) {
    return { success: false, error: "Введите почту и пароль." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { success: false, error: "Неверная пара email/пароль." };
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    return { success: false, error: "Неверная пара email/пароль." };
  }

  await prisma.session.deleteMany({ where: { userId: user.id } });
  await createSession(user.id);

  return { success: true, user: sanitizeUser(user) };
}

export async function logoutUser(): Promise<void> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!cookie) {
    return;
  }

  await destroySession(cookie.value);
}

export async function getCurrentUser(): Promise<PublicUser | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionId) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      user: true,
    },
  });

  if (!session) {
    // Cannot delete cookie in Server Component - will be cleaned up on next login
    return null;
  }

  if (session.expiresAt < new Date()) {
    // Cannot delete cookie in Server Component - expired session is already invalid
    return null;
  }

  return sanitizeUser(session.user);
}

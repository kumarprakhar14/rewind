"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createMemory(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const story = formData.get("story") as string;
  const dateStr = formData.get("date") as string;
  const event = formData.get("event") as string;
  const location = formData.get("location") as string;
  const mediaUrl = formData.get("mediaUrl") as string;

  if (!title || !story || !dateStr) {
    throw new Error("Missing required fields");
  }

  const date = new Date(dateStr);

  await prisma.memory.create({
    data: {
      title,
      story,
      date,
      event: event || null,
      location: location || null,
      mediaUrl: mediaUrl || null,
      authorId: session.user.id,
    },
  });

  revalidatePath("/");
  redirect("/");
}

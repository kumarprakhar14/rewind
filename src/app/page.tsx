import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Navbar } from "@/components/ui/Navbar";
import { MemoryCard } from "@/components/ui/MemoryCard";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);
  console.log(session);
  

  if (!session) {
    redirect("/api/auth/signin");
  }

  const memories = await prisma.memory.findMany({
    orderBy: { date: "desc" },
    include: {
      author: { select: { name: true, image: true } },
      _count: { select: { comments: true, reactions: true } },
    },
  });

  return (
    <div className="min-h-screen pb-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <header className="mb-12 text-center md:text-left">
          <h1 className="font-caveat text-5xl md:text-6xl text-ink font-bold mb-4 transform -rotate-2 inline-block">
            Our Memories
          </h1>
          <p className="text-ink-light font-sans text-lg max-w-xl">
            Welcome to the digital archive. Scroll through the moments that made
            our college journey unforgettable.
          </p>
        </header>

        {memories.length === 0 ? (
          <div className="text-center py-20 bg-paper-dark border border-ink/5 rounded-lg paper-shadow">
            <h3 className="font-marker text-2xl text-ink-light mb-4">
              It's quiet here...
            </h3>
            <p className="text-ink-light mb-6">
              No memories have been added yet. Be the first to share a moment!
            </p>
            <Link
              href="/upload"
              className="inline-block bg-accent hover:bg-accent/90 text-white font-sans font-medium px-6 py-2 rounded shadow-sm transition-colors"
            >
              Add a Memory
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {memories.map((memory) => (
              <MemoryCard
                key={memory.id}
                memory={{
                  id: memory.id,
                  title: memory.title,
                  story: memory.story,
                  date: memory.date.toISOString(),
                  event: memory.event || undefined,
                  location: memory.location || undefined,
                  mediaUrl: memory.mediaUrl || undefined,
                  author: {
                    name: memory.author.name || "Unknown",
                    image: memory.author.image || undefined,
                  },
                  reactionsCount: memory._count.reactions,
                  commentsCount: memory._count.comments,
                }}
              />
            ))}
          </div>
        )}
      </div>

      <Navbar />
    </div>
  );
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { ScribbleCanvas } from "@/components/ui/ScribbleCanvas";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  // Handle "me" shortcut
  const targetId = id === "me" ? session.user.id : id;

  const profile = await prisma.user.findUnique({
    where: { id: targetId },
    include: {
      wallScribbles: true,
      taggedIn: {
        orderBy: { date: "desc" },
        take: 3,
        include: {
          author: { select: { name: true } },
          _count: { select: { reactions: true, comments: true } },
        },
      },
    },
  });

  if (!profile) {
    notFound();
  }

  const isOwnProfile = session.user.id === profile.id;

  return (
    <div className="min-h-screen pb-24 relative bg-paper">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <header className="mb-8 text-center md:text-left flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-accent/20 rounded-full flex items-center justify-center border-4 border-paper shadow-sm">
            <span className="text-4xl md:text-5xl text-accent font-bold">
              {profile.name ? profile.name.charAt(0) : "?"}
            </span>
          </div>
          <div>
            <h1 className="font-marker text-4xl md:text-5xl text-ink mb-1">
              {profile.name || "Unknown Batchmate"}
            </h1>
            <p className="text-ink-light font-sans text-lg">
              {profile.department || "Unknown Dept"} • Batch of{" "}
              {profile.graduationYear || "2024"}
            </p>
          </div>
        </header>

        <section className="mb-12">
          <div className="flex justify-between items-end mb-4">
            <h2 className="font-caveat text-4xl text-ink transform -rotate-1">
              Scribble Wall
            </h2>
            <span className="text-sm text-ink-light font-sans mb-1">
              {profile.wallScribbles.length} notes
            </span>
          </div>
          <ScribbleCanvas
            scribbles={profile.wallScribbles}
            recipientId={profile.id}
          />
        </section>

        {profile.taggedIn.length > 0 && (
          <section>
            <h2 className="font-marker text-2xl text-ink mb-6">
              Featured In...
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {profile.taggedIn.map((memory) => (
                <div
                  key={memory.id}
                  className="bg-paper-dark p-3 rounded paper-shadow hover:-translate-y-1 transition-transform cursor-pointer"
                >
                  {memory.mediaUrl && (
                    <div className="w-full aspect-square bg-ink/5 mb-3">
                      <img
                        src={memory.mediaUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h4 className="font-marker text-lg text-ink truncate">
                    {memory.title}
                  </h4>
                  <p className="text-xs text-ink-light mt-1 truncate">
                    with {memory.author.name}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <Navbar />
    </div>
  );
}

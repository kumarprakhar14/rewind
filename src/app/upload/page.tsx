import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { UploadForm } from "@/components/ui/UploadForm";

export default async function UploadMemoryPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="min-h-screen pb-24 relative bg-paper">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <header className="mb-8 text-center md:text-left">
          <h1 className="font-caveat text-4xl md:text-5xl text-ink font-bold mb-2">
            Add a Memory
          </h1>
          <p className="text-ink-light font-sans text-base">
            What made this moment special? Share the context, not just the photo.
          </p>
        </header>

        <UploadForm />
      </div>
      <Navbar />
    </div>
  );
}

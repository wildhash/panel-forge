import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { UploadDropzone } from "@/components/UploadDropzone";
import { PanelGrid } from "@/components/PanelGrid";
import { PromptBar } from "@/components/PromptBar";
import { PageToolbar } from "@/components/PageToolbar";

export default async function StudioPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b bg-white" role="banner">
        <div className="container-xl mx-auto px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">Studio</h1>
          <div className="flex items-center gap-4">
            <PageToolbar />
            <UserButton />
          </div>
        </div>
      </header>

      <main className="container-xl mx-auto px-8 py-8" role="main">
        <div className="space-y-8">
          <UploadDropzone />
          <PromptBar />
          <PanelGrid />
        </div>
      </main>
    </div>
  );
}

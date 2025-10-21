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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Panel Forge Studio</h1>
          <div className="flex items-center gap-4">
            <PageToolbar />
            <UserButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <UploadDropzone />
          <PromptBar />
          <PanelGrid />
        </div>
      </main>
    </div>
  );
}

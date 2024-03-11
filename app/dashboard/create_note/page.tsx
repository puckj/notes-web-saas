import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/app/lib/db";
import { redirect } from "next/navigation";
import NoteForm from "@/components/NoteForm";
import { unstable_noStore as noStore } from "next/cache";

const CreateNotePage = async () => {
  noStore();
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const createNoteHandler = async (formData: FormData) => {
    "use server";

    if (!user) {
      throw new Error("Not authorized");
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    await prisma.note.create({
      data: {
        userId: user?.id,
        description: description,
        title: title,
      },
    });
    return redirect("/dashboard");
  };

  return <NoteForm formAction={createNoteHandler} mode="create" />;
};

export default CreateNotePage;

import NoteForm from "@/components/NoteForm";
import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";

const getNoteData = async ({ userId, noteId }: getNoteDataProps) => {
  noStore();
  const data = await prisma.note.findUnique({
    where: {
      id: noteId,
      userId: userId,
    },
    select: {
      title: true,
      description: true,
      id: true,
    },
  });
  return data;
};

const EditNotePage = async ({ params }: { params: { id: string } }) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const noteData = await getNoteData({
    userId: user?.id as string,
    noteId: params.id as string,
  });

  const editNoteHandler = async (formData: FormData) => {
    "use server";

    if (!user) {
      throw new Error("Not authorized");
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    await prisma.note.update({
      where: { id: noteData?.id, userId: user.id },
      data: {
        title: title,
        description: description,
      },
    });
    revalidatePath("/dashboard");
    return redirect("/dashboard");
  };

  return (
    <NoteForm formAction={editNoteHandler} mode="edit" noteData={noteData!} />
  );
};

export default EditNotePage;

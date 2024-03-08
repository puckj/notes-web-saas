import NoteForm from "@/components/NoteForm";
import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const getNoteData = async ({ userId, noteId }: getNoteDataProps) => {
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
  console.log(noteData);
  
  return <NoteForm mode="edit" noteData={noteData!} />;
};

export default EditNotePage;

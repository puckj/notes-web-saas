import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/app/lib/db";
import { redirect } from "next/navigation";
import NoteForm from "@/components/NoteForm";

const CreateNotePage = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const postData = async (formData: FormData) => {
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

  return <NoteForm formAction={postData} mode="create" />;
};

export default CreateNotePage;

import { SubmitButton } from "@/components/CustomButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

const NoteForm = ({ formAction, mode, noteData }: NoteFormProps) => {
  return (
    <Card>
      <form action={formAction}>
        <CardHeader>
          <CardTitle>
            {mode === "create" ? "Create New Note" : "Edit Note"}
          </CardTitle>
          <CardDescription>
            {mode === "create"
              ? "Create a new note with a title and content"
              : "Edit a note"}
            , then save to organize your thoughts
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-5">
          <div className="gap-y-2 flex flex-col">
            <Label>Title</Label>
            <Input
              required
              type="text"
              name="title"
              placeholder="Enter title here"
              defaultValue={mode === "edit" ? noteData!.title : undefined}
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label>Description</Label>
            <Textarea
              required
              name="description"
              placeholder="Enter description here"
              defaultValue={mode === "edit" ? noteData!.description : undefined}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button asChild variant="destructive">
            <Link href="/dashboard">Cancel</Link>
          </Button>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
};

export default NoteForm;

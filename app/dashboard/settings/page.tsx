import { SubmitButton } from "@/components/CustomButton";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { colorScheme } from "@/constants";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";

const getUserData = async (userId: string) => {
  noStore();
  const data = await prisma?.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
      email: true,
      colorScheme: true,
    },
  });
  return data;
};

const SettingsPage = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userData = await getUserData(user?.id as string);

  const postData = async (formData: FormData) => {
    "use server";

    const name = formData.get("name") as string;
    const colorScheme = formData.get("color") as string;

    await prisma?.user.update({
      where: {
        id: user?.id,
      },
      data: {
        name: name,
        colorScheme: colorScheme,
      },
    });

    revalidatePath("/", "layout"); // Revalidate the root layout to change the color scheme of the UI.
  };

  return (
    <div className="grid items-start gap-8">
      <div className="flex items-center justify-between px-2">
        <div className="grid gap-1">
          <h1 className="text-3xl md:text-4xl">Settings</h1>
          <p className="text-lg text-muted-foreground">Your Profile settings</p>
        </div>
      </div>
      <Card>
        <form action={postData}>
          <CardHeader>
            <CardTitle>General Data</CardTitle>
            <CardDescription>
              Please provide general information about yourself. Don&apos;t
              forget to save.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="space-y-1">
                <Label>Name</Label>
                <Input
                  name="name"
                  type="text"
                  id="name"
                  placeholder="Your Name"
                  defaultValue={userData?.name ?? undefined}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Email</Label>
                <Input
                  name="email"
                  type="email"
                  id="email"
                  placeholder="Your Email"
                  defaultValue={userData?.email}
                  disabled
                />
              </div>
              <div className="space-y-1">
                <Label>Color Scheme</Label>
                <Select name="color" defaultValue={userData?.colorScheme}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Color Scheme</SelectLabel>
                      {colorScheme.map((item, index) => (
                        <SelectItem value={item.value} key={index}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SettingsPage;

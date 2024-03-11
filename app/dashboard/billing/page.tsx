import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { featureItems } from "@/constants";
import { CheckCircle2 } from "lucide-react";
import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getStripeSession, stripe } from "@/app/lib/stripe";
import { redirect } from "next/navigation";
import {
  StripePortalButton,
  StripeSubscriptionCreationButton,
} from "@/components/CustomButton";
import { unstable_noStore as noStore } from "next/cache";

const getUserData = async (userId: string) => {
  noStore();
  const data = await prisma.subscription.findUnique({
    where: {
      userId: userId,
    },
    select: {
      status: true,
      user: {
        select: {
          stripeCustomerId: true,
        },
      },
    },
  });
  return data;
};

const BillingPage = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userData = await getUserData(user?.id as string);
  //   console.log(user, "<<< user");
  //   console.log(userData, "<<< userData");

  const createSubscription = async () => {
    "use server";
    const dbUser = await prisma.user.findUnique({
      where: {
        id: user?.id,
      },
      select: {
        stripeCustomerId: true,
      },
    });
    if (!dbUser?.stripeCustomerId) {
      throw new Error("Unable to get customer id");
    }
    const subscriptionUrl = await getStripeSession({
      customerId: dbUser.stripeCustomerId,
      domainUrl: process.env.WEBSITE_URL as string,
      priceId: process.env.STRIPE_PRICE_ID as string,
    });
    return redirect(subscriptionUrl);
  };

  const createCustomerPortal = async () => {
    "use server";
    const session = await stripe.billingPortal.sessions.create({
      customer: userData?.user.stripeCustomerId as string,
      return_url: `${process.env.WEBSITE_URL}/dashboard/billing`,
    });
    return redirect(session.url);
  };

  return (
    <>
      {userData?.status === "active" ? (
        <div className="grid items-start gap-8">
          <div className="flex items-center justify-between px-2">
            <div className="grid gap-1">
              <h1 className="text-3xl md:text-4xl">Subscription</h1>
              <p className="text-lg text-muted-foreground">
                Subscription Settings
              </p>
            </div>
          </div>
          <Card className="w-full lg:w-2/3">
            <CardHeader>
              <CardTitle>Edit Subscription</CardTitle>
              <CardDescription>
                Please click on the button below to access the option to update
                your payment details and view your statement.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={createCustomerPortal}>
                <StripePortalButton />
              </form>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="max-w-md mx-auto space-y-4">
          <Card className="flex flex-col">
            <CardContent className="py-8">
              <div>
                <h3
                  className="inline-flex px-4 py-1 rounded-full text-sm 
              font-semibold tracking-wide uppercase bg-primary/10 text-primary"
                >
                  Monthly
                </h3>
              </div>
              <div className="mt-4 flex items-baseline text-6xl font-extrabold">
                $30{" "}
                <span className="ml-4 text-2xl text-muted-foreground">/mo</span>
              </div>
              <p className="mt-5 text-lg text-muted-foreground">
                Write as many notes as you want for $30 a Month
              </p>
            </CardContent>
            <div
              className="flex-1 flex flex-col justify-between px-6 pt-6 
          pb-8 bg-secondary rounded-lg m-1 space-y-6 sm:p-10 sm:pt-6"
            >
              <ul className="space-y-4">
                {featureItems.map((item, index) => (
                  <li key={index} className="flex items-center">
                    <div className="flex-shrink-0">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    </div>
                    <p className="ml-3 text-base">{item.name}</p>
                  </li>
                ))}
              </ul>
              <form className="w-full" action={createSubscription}>
                <StripeSubscriptionCreationButton />
              </form>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default BillingPage;

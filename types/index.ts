type UserNavProps = {
    name: string;
    email: string;
    image: string;
}

type getDataProps = {
    email: string;
    id: string;
    firstName: string | undefined | null;
    lastName: string | undefined | null;
    profileImage: string | undefined | null;
}

type getStripeSessionProps = {
    priceId: string;
    domainUrl: string;
    customerId: string;
}

type getNoteDataProps = {
    userId: string;
    noteId: string;
}

type NoteFormProps = {
    formAction?: any;
    mode: "create" | "edit";
    noteData?: {
        title: string;
        description: string;
        id: string;
    }
}


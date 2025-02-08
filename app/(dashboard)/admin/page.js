import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";

const page = async () => {
    const session = await getServerSession(authOptions);


    if (session?.user) {
        return (
            <h2 className="text-2xl">
                Admin Page - Welcome Back {(session?.user.username)}
            </h2>
        );
    }

    return <h2>Please login to see this</h2>;
};

export default page;

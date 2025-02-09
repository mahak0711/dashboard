import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";

const page = async () => {
    const session = await getServerSession(authOptions);

    if (session?.user) {
        return (
            <h2 className="mt-16 text-4xl">
                Admin Page - Welcome Back, {session.user.username || session.user.name || session.user.email}
            </h2>
        );
    }

    return <h2>Please login to see this</h2>;
};

export default page;

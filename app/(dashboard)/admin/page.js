import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

const page=async()=>{
    const session=await getServerSession(authOptions)
    console.log(session);
    
    return(
        <div>
            <h1>Admin page</h1>
            <p>My page content</p>
        </div>
    )

}
export default page;
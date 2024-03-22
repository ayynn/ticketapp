import options from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export default async function useSessionCheck() {
    const session = await getServerSession(options)
    return Boolean(session)
}
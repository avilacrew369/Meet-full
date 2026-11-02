
import { auth } from "./auth";
import { headers } from "next/headers";
import { connection } from "next/server";

export async function getServerSession() {
    await connection();

    const session = await auth.api.getSession({
        headers: await headers(),
        // force: "auto"

    })
    return session

}
export async function requireAuth() {
    const session = await getServerSession()


    return {
        session,
        isAuth: session ? true : false
    }
}

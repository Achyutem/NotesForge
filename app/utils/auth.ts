import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function verifyAuth(request: Request) {
	try {
		const cookieStore = cookies();
		const token = (await cookieStore).get("auth-token")?.value;

		if (!token) return null;

		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET || "default-secret"
		) as { userId: number };
		return decoded;
	} catch (error) {
		console.error("Auth verification error:", error);
		return null;
	}
}

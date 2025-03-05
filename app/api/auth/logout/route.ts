import { NextResponse } from "next/server";


export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: { "Access-Control-Allow-Origin": "*" } });
}

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: "Logout successful" },
      { status: 200, headers: { "Access-Control-Allow-Origin": "*" } }
    );

    response.cookies.set({
      name: "auth-token",
      value: "",
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}

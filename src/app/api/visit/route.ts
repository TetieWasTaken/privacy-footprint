import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const lastVisited = request.cookies.get("last-visited")?.value || "Never";

	const response = NextResponse.json({ lastVisited });

	response.cookies.set("last-visited", Date.now().toString(), {
		path: "/",
		httpOnly: false,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
	});

	return response;
}

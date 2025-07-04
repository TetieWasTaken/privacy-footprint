import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const ip = request.headers.get("x-forwarded-for") || "0.0.0.0";
	return NextResponse.json({ ip });
}

export async function GET(req: Request) {
	const ip = new URL(req.url).searchParams.get("ip");
	if (!ip) return new Response("Missing IP", { status: 400 });

	const res = await fetch(`http://ip-api.com/json/${ip}?fields=25424384`);
	const data = await res.json();
	return new Response(JSON.stringify(data), {
		headers: { "Content-Type": "application/json" },
	});
}

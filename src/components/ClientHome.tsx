"use client";

import { useState, useEffect } from "react";
import Card from "./Card";
import { Geo } from "@vercel/functions";

function getOS(): string {
	if (/Windows NT/.test(navigator.userAgent)) return "Windows";
	if (/Mac OS X/.test(navigator.userAgent)) return "macOS";
	if (/Android/.test(navigator.userAgent)) return "Android";
	if (/iPhone|iPad|iPod/.test(navigator.userAgent)) return "iOS";
	if (/Linux/.test(navigator.userAgent)) return "Linux";
	return "Unknown OS";
}

export default function ClientHome() {
	const [proceeded, setProceeded] = useState(false);
	const [ip, setIp] = useState<string | null>(null);
	const [geo, setGeo] = useState<Geo | null>(null);
	const [os, setOs] = useState<string | null>(null);

	useEffect(() => {
		if (proceeded) {
			fetch("/api/ip")
				.then((res) => res.json())
				.then((data) => setIp(data.ip))
				.catch(console.error);

			fetch("/api/geo")
				.then((res) => res.json())
				.then((data) => setGeo(data.geo))
				.catch(console.error);

			setOs(getOS());
		}
	}, [proceeded]);

	if (!proceeded) {
		return (
			<div className="bg-red-900 min-h-screen flex flex-col justify-center items-center text-white">
				<h1 className="text-2xl font-bold mb-4">⚠️ WARNING</h1>
				<p className="mb-6">Proceeding will reveal sensitive information.</p>
				<button onClick={() => setProceeded(true)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
					Proceed
				</button>
			</div>
		);
	}

	return (
		<div className="bg-gray-900 min-h-screen py-10 px-4">
			<div className="max-w-9/10 mx-auto grid grid-cols-2 md:grid-cols-3 gap-6">
				<Card item={ip || "IP not available"} method="x-forwarded-for" description="That is your IP address" />
				<Card
					item={geo?.city && geo?.country ? `${geo.city}, ${geo.country}` : "Location unavailable"}
					method="Geolocation API"
					description="That is your location"
				/>
				<Card item={navigator.languages.join(",")} method={"navigator"} description="List of preferred languages" />
				<Card
					item={os}
					method="User Agent"
					description="This is the operating system you're using. Depending on the system, the specific version may be revealed as well."
				/>
			</div>
		</div>
	);
}

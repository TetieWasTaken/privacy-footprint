"use client";

import { useState, useEffect } from "react";
import Card from "./Card";
import { Geo } from "@vercel/functions";

export default function ClientHome() {
	const [proceeded, setProceeded] = useState(false);
	const [ip, setIp] = useState<string | null>(null);
	const [geo, setGeo] = useState<Geo | null>(null);

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
			<div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
				<Card item={ip || "IP not available"} method="x-forwarded-for" description="That is your IP address" />
				<Card
					item={geo?.city && geo?.country ? `${geo.city}, ${geo.country}` : "Location unavailable"}
					method="Geolocation API"
					description="That is your location"
				/>
			</div>
		</div>
	);
}

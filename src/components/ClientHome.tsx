"use client";

import { useState, useEffect } from "react";
import Card from "./Card";

export default function ClientHome() {
	const [proceeded, setProceeded] = useState(false);
	const [ip, setIp] = useState<string | null>(null);

	useEffect(() => {
		if (proceeded) {
			fetch("/api/ip")
				.then((res) => res.json())
				.then((data) => setIp(data.ip))
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
		<div className="bg-gray-900 min-h-screen p-4">
			<Card item={ip} method="x-forwarded-for" description="That is your IP address" />
		</div>
	);
}

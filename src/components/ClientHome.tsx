"use client";

import { useState, useEffect } from "react";

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
			<div className="bg-gray-700 rounded-lg p-6 max-w-sm w-full">
				<h1 className="text-xl font-bold text-white mb-2">{ip ?? "Loading IP..."}</h1>
				<p className="text-gray-300 mb-2">That is your IP address</p>
				<p className="text-blue-400 hover:underline">Link</p>
			</div>
		</div>
	);
}

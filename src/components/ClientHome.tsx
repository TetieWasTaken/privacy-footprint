"use client";

import { useState, useEffect } from "react";
import Card from "./Card";
import Loading from "@/app/loading";
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
	const [bluetoothAvailable, setBluetoothAvailable] = useState(false);

	const [loadingIp, setLoadingIp] = useState(true);
	const [loadingGeo, setLoadingGeo] = useState(true);
	const [loadingBluetooth, setLoadingBluetooth] = useState(true);

	useEffect(() => {
		if (proceeded) {
			setOs(getOS());

			fetch("/api/ip")
				.then((res) => res.json())
				.then((data) => setIp(data.ip))
				.catch(console.error)
				.finally(() => setLoadingIp(false));

			fetch("/api/geo")
				.then((res) => res.json())
				.then((data) => setGeo(data.geo))
				.catch(console.error)
				.finally(() => setLoadingGeo(false));

			if (navigator.bluetooth && navigator.bluetooth.getAvailability) {
				navigator.bluetooth
					.getAvailability()
					.then(setBluetoothAvailable)
					.catch(() => {
						setBluetoothAvailable(false);
					})
					.finally(() => setLoadingBluetooth(false));
			} else {
				setLoadingBluetooth(false);
			}
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
				{loadingIp ? (
					<Loading />
				) : (
					<Card item={ip || "IP not available"} method="x-forwarded-for" description="That is your IP address" />
				)}

				{loadingGeo ? (
					<Loading />
				) : (
					<Card
						item={geo?.city && geo?.country ? `${geo.city}, ${geo.country}` : "Location unavailable"}
						method="Geolocation API"
						description="That is your location"
					/>
				)}

				<Card item={navigator.languages.join(",")} method="navigator" description="List of preferred languages" />

				{loadingBluetooth ? (
					<Loading />
				) : (
					<Card
						item={"Bluetooth access"}
						method="Bluetooth API"
						description="This website can interact with your bluetooth (devices)."
						available={bluetoothAvailable}
					/>
				)}

				<Card
					item={os}
					method="User Agent"
					description="This is the operating system you're using. Depending on the system, the specific version may be revealed as well."
				/>
			</div>
		</div>
	);
}

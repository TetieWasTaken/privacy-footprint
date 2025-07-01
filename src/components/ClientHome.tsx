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
	const [lastVisited, setLastVisited] = useState<string | null>(null);
	const [ISP, setISP] = useState<string | null>(null);
	const [currency, setCurrency] = useState<string | null>(null);
	const [reverse, setReverse] = useState<string | null>(null);
	const [mobile, setMobile] = useState<boolean | null>(null);
	const [proxy, setProxy] = useState<boolean | null>(null);
	const [hosting, setHosting] = useState<boolean | null>(null);

	const [loadingIp, setLoadingIp] = useState(true);
	const [loadingGeo, setLoadingGeo] = useState(true);
	const [loadingBluetooth, setLoadingBluetooth] = useState(true);
	const [loadingVisited, setLoadingVisited] = useState(true);
	const [loadingISP, setLoadingISP] = useState(true);
	const [loadingCurrency, setLoadingCurrency] = useState(true);
	const [loadingReverse, setLoadingReverse] = useState(true);
	const [loadingMobile, setLoadingMobile] = useState(true);
	const [loadingProxy, setLoadingProxy] = useState(true);
	const [loadingHosting, setLoadingHosting] = useState(true);

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

			fetch("/api/visit")
				.then((res) => res.json())
				.then((data) => {
					const timestamp = parseInt(data.lastVisited);
					if (!isNaN(timestamp)) {
						const offset = new Date(timestamp).getTimezoneOffset();
						setLastVisited(new Date(new Date(timestamp).getTime() - offset * 60 * 1000).toISOString());
					} else setLastVisited(data.lastVisited);
				})
				.catch(console.error)
				.finally(() => setLoadingVisited(false));

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

	useEffect(() => {
		if (ip && ip !== "0.0.0.0") {
			setLoadingISP(true);
			setLoadingCurrency(true);
			setLoadingReverse(true);
			setLoadingMobile(true);
			setLoadingProxy(true);
			setLoadingHosting(true);

			fetch(`/api/ip-lookup?ip=${ip}`)
				.then((res) => res.json())
				.then((data) => {
					if (data.status === "success") {
						setISP(data.isp);
						setCurrency(data.currency);
						setReverse(data.reverse);
						setMobile(data.mobile);
						setProxy(data.proxy);
						setHosting(data.hosting);
					} else {
						console.log(data.message);
						setISP(null);
						setCurrency(null);
						setReverse(null);
						setMobile(null);
						setProxy(null);
						setHosting(null);
					}
				})
				.catch((err) => {
					console.error(err);
					setISP(null);
					setCurrency(null);
					setReverse(null);
					setMobile(null);
					setProxy(null);
					setHosting(null);
				})
				.finally(() => {
					setLoadingISP(false);
					setLoadingCurrency(false);
					setLoadingReverse(false);
					setLoadingMobile(false);
					setLoadingProxy(false);
					setLoadingHosting(false);
				});
		}
		// Only run when ip changes and proceeded is true
	}, [ip]);

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

				{loadingVisited ? (
					<Loading />
				) : (
					<Card item={lastVisited} method="last-visited (cookie)" description="Last visited this website" />
				)}

				{loadingISP ? (
					<Loading />
				) : (
					<Card item={ISP || "ISP not available"} method="IP-API" description="Your Internet Service Provider" />
				)}

				{loadingCurrency ? (
					<Loading />
				) : (
					<Card item={currency || "Currency not available"} method="IP-API" description="Your local currency" />
				)}

				{loadingReverse ? (
					<Loading />
				) : (
					<Card item={reverse || "Reverse DNS not available"} method="IP-API" description="Your reverse DNS" />
				)}

				{loadingMobile ? (
					<Loading />
				) : (
					<Card
						item={mobile ? "Yes" : "No"}
						method="IP-API"
						description="Whether you're using a mobile network or not"
					/>
				)}

				{loadingProxy ? (
					<Loading />
				) : (
					<Card item={proxy ? "Yes" : "No"} method="IP-API" description="Whether you're using a proxy or not" />
				)}

				{loadingHosting ? (
					<Loading />
				) : (
					<Card
						item={hosting ? "Yes" : "No"}
						method="IP-API"
						description="Whether you're using a hosting service or not"
					/>
				)}
			</div>
		</div>
	);
}

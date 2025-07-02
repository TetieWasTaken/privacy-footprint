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

type ItemKey =
	| "ip"
	| "geo"
	| "languages"
	| "bluetooth"
	| "os"
	| "lastVisited"
	| "isp"
	| "currency"
	| "reverse"
	| "mobile"
	| "proxy"
	| "hosting";

type Item = {
	label: string;
	method: string;
	description: string;
	value: string | boolean | null;
	loading: boolean;
	available?: boolean;
};

export default function ClientHome() {
	const [proceeded, setProceeded] = useState(false);

	const [items, setItems] = useState<Record<ItemKey, Item>>({
		ip: {
			label: "IP Address",
			method: "x-forwarded-for",
			description: "That is your IP address",
			value: null,
			loading: true,
		},
		geo: {
			label: "Location",
			method: "Geolocation API",
			description: "That is your location",
			value: null,
			loading: true,
		},
		languages: {
			label: "Languages",
			method: "navigator",
			description: "List of preferred languages",
			value: typeof navigator !== "undefined" ? navigator.languages.join(",") : "",
			loading: false,
		},
		bluetooth: {
			label: "Bluetooth access",
			method: "Bluetooth API",
			description: "This website can interact with your bluetooth (devices).",
			value: false,
			loading: true,
			available: false,
		},
		os: {
			label: "Operating System",
			method: "User Agent",
			description:
				"This is the operating system you're using. Depending on the system, the specific version may be revealed as well.",
			value: null,
			loading: false,
		},
		lastVisited: {
			label: "Last Visited",
			method: "last-visited (cookie)",
			description: "Last visited this website",
			value: null,
			loading: true,
		},
		isp: {
			label: "ISP",
			method: "IP-API",
			description: "Your Internet Service Provider",
			value: null,
			loading: true,
		},
		currency: {
			label: "Currency",
			method: "IP-API",
			description: "Your local currency",
			value: null,
			loading: true,
		},
		reverse: {
			label: "Reverse DNS",
			method: "IP-API",
			description: "Your reverse DNS",
			value: null,
			loading: true,
		},
		mobile: {
			label: "Mobile Network",
			method: "IP-API",
			description: "Whether you're using a mobile network or not",
			value: null,
			loading: true,
		},
		proxy: {
			label: "Proxy",
			method: "IP-API",
			description: "Whether you're using a proxy or not",
			value: null,
			loading: true,
		},
		hosting: {
			label: "Hosting",
			method: "IP-API",
			description: "Whether you're using a hosting service or not",
			value: null,
			loading: true,
		},
	});

	useEffect(() => {
		if (!proceeded) return;

		setItems((prev) => ({
			...prev,
			os: { ...prev.os, value: getOS() },
			languages: { ...prev.languages, value: navigator.languages.join(",") },
		}));

		fetch("/api/ip")
			.then((res) => res.json())
			.then((data) =>
				setItems((prev) => ({
					...prev,
					ip: { ...prev.ip, value: data.ip, loading: false },
				}))
			)
			.catch(() =>
				setItems((prev) => ({
					...prev,
					ip: { ...prev.ip, value: "IP not available", loading: false },
				}))
			);

		fetch("/api/geo")
			.then((res) => res.json())
			.then((data) =>
				setItems((prev) => ({
					...prev,
					geo: {
						...prev.geo,
						value:
							data.geo?.city && data.geo?.country ? `${data.geo.city}, ${data.geo.country}` : "Location unavailable",
						loading: false,
					},
				}))
			)
			.catch(() =>
				setItems((prev) => ({
					...prev,
					geo: { ...prev.geo, value: "Location unavailable", loading: false },
				}))
			);

		fetch("/api/visit")
			.then((res) => res.json())
			.then((data) => {
				const timestamp = parseInt(data.lastVisited);
				let lastVisited: string | null = data.lastVisited;
				if (!isNaN(timestamp)) {
					const offset = new Date(timestamp).getTimezoneOffset();
					lastVisited = new Date(new Date(timestamp).getTime() - offset * 60 * 1000).toISOString();
				}
				setItems((prev) => ({
					...prev,
					lastVisited: { ...prev.lastVisited, value: lastVisited, loading: false },
				}));
			})
			.catch(() =>
				setItems((prev) => ({
					...prev,
					lastVisited: { ...prev.lastVisited, value: null, loading: false },
				}))
			);

		if (navigator.bluetooth && navigator.bluetooth.getAvailability) {
			navigator.bluetooth
				.getAvailability()
				.then((available) =>
					setItems((prev) => ({
						...prev,
						bluetooth: { ...prev.bluetooth, value: "Bluetooth access", available, loading: false },
					}))
				)
				.catch(() =>
					setItems((prev) => ({
						...prev,
						bluetooth: { ...prev.bluetooth, value: "Bluetooth access", available: false, loading: false },
					}))
				);
		} else {
			setItems((prev) => ({
				...prev,
				bluetooth: { ...prev.bluetooth, value: "Bluetooth access", available: false, loading: false },
			}));
		}
	}, [proceeded]);

	useEffect(() => {
		const ip = items.ip.value;
		if (!proceeded || !ip || ip === "0.0.0.0") return;

		const setLoading = (loading: boolean) =>
			setItems((prev) => ({
				...prev,
				isp: { ...prev.isp, loading },
				currency: { ...prev.currency, loading },
				reverse: { ...prev.reverse, loading },
				mobile: { ...prev.mobile, loading },
				proxy: { ...prev.proxy, loading },
				hosting: { ...prev.hosting, loading },
			}));

		setLoading(true);

		fetch(`/api/lookup?ip=${ip}`)
			.then((res) => res.json())
			.then((data) => {
				if (data.status === "success") {
					setItems((prev) => ({
						...prev,
						isp: { ...prev.isp, value: data.isp, loading: false },
						currency: { ...prev.currency, value: data.currency, loading: false },
						reverse: { ...prev.reverse, value: data.reverse, loading: false },
						mobile: { ...prev.mobile, value: data.mobile ? "Yes" : "No", loading: false },
						proxy: { ...prev.proxy, value: data.proxy ? "Yes" : "No", loading: false },
						hosting: { ...prev.hosting, value: data.hosting ? "Yes" : "No", loading: false },
					}));
				} else {
					setItems((prev) => ({
						...prev,
						isp: { ...prev.isp, value: null, loading: false },
						currency: { ...prev.currency, value: null, loading: false },
						reverse: { ...prev.reverse, value: null, loading: false },
						mobile: { ...prev.mobile, value: null, loading: false },
						proxy: { ...prev.proxy, value: null, loading: false },
						hosting: { ...prev.hosting, value: null, loading: false },
					}));
				}
			})
			.catch(() =>
				setItems((prev) => ({
					...prev,
					isp: { ...prev.isp, value: null, loading: false },
					currency: { ...prev.currency, value: null, loading: false },
					reverse: { ...prev.reverse, value: null, loading: false },
					mobile: { ...prev.mobile, value: null, loading: false },
					proxy: { ...prev.proxy, value: null, loading: false },
					hosting: { ...prev.hosting, value: null, loading: false },
				}))
			);
	}, [items.ip.value, proceeded]);

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

	const itemOrder: ItemKey[] = [
		"ip",
		"geo",
		"languages",
		"bluetooth",
		"os",
		"lastVisited",
		"isp",
		"currency",
		"reverse",
		"mobile",
		"proxy",
		"hosting",
	];

	return (
		<div className="bg-gray-900 min-h-screen py-10 px-4">
			<div className="max-w-9/10 mx-auto grid grid-cols-2 md:grid-cols-3 gap-6">
				{itemOrder.map((key) => {
					const item = items[key];
					if (item.loading) return <Loading key={key} />;
					return (
						<Card
							key={key}
							item={item.value?.toString() || null}
							method={item.method}
							description={item.description}
							available={item.available === undefined ? (item.value ? true : false) : item.available}
						/>
					);
				})}
			</div>
		</div>
	);
}

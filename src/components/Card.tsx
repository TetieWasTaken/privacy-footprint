interface CardProps {
	item: string | null;
	method: string;
	description: string;
	link?: { href: string; title: string };
}

export default function Card(props: CardProps) {
	return (
		<div className="bg-gray-700 rounded-lg p-6 max-w-sm w-full">
			<h1 className="text-xl font-bold text-white mb-2">{props.item ?? "Loading..."}</h1>
			<p className="text-gray-300 mb-2">{props.method}</p>
			<p className="text-gray-300 mb-2">{props.description}</p>
			{props.link && <p className="text-blue-400 hover:underline">{props.link.title}</p>}
		</div>
	);
}

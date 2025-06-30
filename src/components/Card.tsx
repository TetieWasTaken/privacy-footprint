interface CardProps {
	item: string | null;
	method: string;
	description: string;
	link?: { href: string; title: string };
}

export default function Card(props: CardProps) {
	return (
		<div className="bg-gray-800 text-white rounded-lg shadow p-6">
			<h2 className="text-lg font-semibold mb-2">{props.method}</h2>
			<p className="text-xl font-mono break-all mb-1">{props.item}</p>
			<p className="text-sm text-gray-400">{props.description}</p>
		</div>
	);
}

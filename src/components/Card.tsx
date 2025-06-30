interface CardProps {
	item: string | null;
	method: string;
	description: string;
	link?: { href: string; title: string };
	available?: boolean;
}

export default function Card({ item, method, description, link, available = true }: CardProps) {
	const cardClasses = `bg-gray-800 text-white rounded-lg shadow p-6 transition-opacity ${
		available ? "" : "opacity-50 cursor-not-allowed"
	}`;

	return (
		<div className={cardClasses}>
			<h2 className="text-sm font-semibold mb-2">{method}</h2>
			<p className="text-xl font-mono break-all mb-1">{item}</p>
			<p className="text-sm text-gray-400">{description}</p>
			{link && (
				<a
					href={link.href}
					className="text-blue-400 hover:underline mt-2 inline-block"
					target="_blank"
					rel="noopener noreferrer"
				>
					{link.title}
				</a>
			)}
		</div>
	);
}

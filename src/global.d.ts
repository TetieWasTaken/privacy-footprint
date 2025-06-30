export {};

declare global {
	interface Navigator {
		bluetooth?: {
			getAvailability: () => Promise<boolean>;
		};
	}
}

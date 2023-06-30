export const dateFormatter = {
	locale(date: number | string | Date,
		   locale: string | undefined = undefined,
		   options: {} = {}): string {
		const localDate = new Date(date);
		return localDate.toLocaleDateString(locale, options);
	},
};

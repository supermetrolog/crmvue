const formatter = new Intl.NumberFormat('ru', { minimumIntegerDigits: 2 });

export function toTimeFormat(value: number) {
    let minutes = Math.floor(value / 60);
    const seconds = value % 60;

    if (minutes > 60) {
        const hours = Math.floor(minutes / 60);

        minutes = minutes % 60;

        return `${formatter.format(hours)}:${formatter.format(minutes)}:${formatter.format(seconds)}`;
    }

    return `${formatter.format(minutes)}:${formatter.format(seconds)}`;
}

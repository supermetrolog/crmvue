export function optionsToList(options) {
    return Object.keys(options).map(key => ({ value: Number(key), label: options[key] }));
}

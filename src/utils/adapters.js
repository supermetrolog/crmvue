export const multiselectAdapter = (options, value, label) => {
    if (typeof label === 'string')
        return options.map(item => ({ value: item[value], label: item[label] }));
    else if (typeof label === 'function') {
        return options.map(item => ({ value: item[value], label: label(item) }));
    }
};

export const multiselectAdapterToObject = (options, value, label) => {
    if (typeof label === 'string')
        return options.reduce((arr, item) => {
            arr[item[value]] = item[label];
            return arr;
        }, {});
    else if (typeof label === 'function') {
        return options.reduce((arr, item) => {
            arr[item[value]] = label(item);
            return arr;
        }, {});
    }
};

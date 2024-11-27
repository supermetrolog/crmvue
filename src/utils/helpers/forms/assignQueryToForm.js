export function assignQueryToForm(query, formObject) {
    Object.keys(query).forEach(key => {
        if (key in formObject) {
            if (Array.isArray(formObject[key]) && !Array.isArray(query[key]))
                formObject[key] = [query[key]];
            else if (Array.isArray(query[key]) && !Array.isArray(formObject[key])) {
                formObject[key] = query[key][query[key].length - 1];
            } else formObject[key] = query[key];
        }
    });
}

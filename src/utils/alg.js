const strictMin = (...args) => {
    return Math.min(...args.filter(element => element !== 0 && element !== null));
};

const filterArrayByPropertyEntity = (array, property) => {
    return array.reduce((acc, element) => {
        if (element[property] in acc) acc[element[property]].push(element);
        else acc[element[property]] = [element];

        return acc;
    }, {});
};

const extractDeepProperty = (object, properties) => {
    const extractObject = (obj, prop) => {
        if (prop.length > 1) {
            if (obj[prop[0]] instanceof Array)
                return obj[prop[0]].reduce(
                    (acc, element) => [...acc, ...extractObject(element, prop.slice(1))],
                    []
                );

            return extractObject(obj[prop[0]], prop.slice(1));
        }

        if (obj[prop[0]] instanceof Array) return obj[prop[0]];

        return [obj[prop[0]]];
    };

    if (properties instanceof Array) {
        return properties.map(propertiesItem => extractObject(object, propertiesItem.split('.')));
    }

    return extractObject(object, properties.split('.'));
};

const deleteObjectsWithUndueProperties = (
    iterObject,
    properties,
    value = null,
    options = { strict: false }
) => {
    if (properties instanceof Array)
        return iterObject.reduce((acc, element) => {
            const countPropertiesAfterPredicate = properties.filter(
                property =>
                    element[property] == value ||
                    element[property] === null ||
                    (element[property] instanceof Array && !element[property].length)
            ).length;

            if (
                options.strict
                    ? countPropertiesAfterPredicate === properties.length
                    : countPropertiesAfterPredicate
            )
                return acc;
            return [...acc, element];
        }, []);

    return iterObject.filter(element => {
        if (element[properties] instanceof Array) return element[properties].length;
        return element[properties] != value && element[properties] !== null;
    });
};

const chunk = (array, size) => {
    const result = [];

    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }

    return result;
};

const parts = (array, size) => {
    const result = Array.from(Array(Math.min(array.length, size)), () => []);

    for (let i = 0; i < array.length; i++) {
        result[i % size].push(array[i]);
    }

    return result;
};

const predicates = {
    compareString: property => (first, second) => {
        if (first[property] > second[property]) return 1;
        if (first[property] < second[property]) return -1;
        return 0;
    }
};

const extractPropertiesFromObject = (object, properties) => {
    return properties.reduce((acc, property) => ({ ...acc, [property]: object[property] }), {});
};

const isNumeric = num => {
    return !isNaN(+num);
};

export const alg = {
    strictMin,
    filterArrayByPropertyEntity,
    extractDeepProperty,
    deleteObjectsWithUndueProperties,
    chunk,
    extractPropertiesFromObject,
    isNumeric,
    parts,
    predicates
};

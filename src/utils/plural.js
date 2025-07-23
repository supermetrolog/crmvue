export function plural(num, ...forms) {
    return toPlural(num, toCorrectForms(forms));
}

export function pluralTemplate(template, num, ...forms) {
    const text = plural(num, ...forms);

    return template.replace(/%s/g, text);
}

export function pluralVerb(num, ...forms) {
    return toPluralVerb(num, toCorrectForms(forms));
}

function toPlural(num, forms) {
    if (forms.length === 2) {
        return toFormat(num > 1 ? forms[1] : forms[0], num);
    }

    return toFormat(forms[getNounPluralForm(num)], num);
}

function toPluralVerb(num, forms) {
    return toFormat(forms[getVerbPluralForm(num)], num);
}

function getVerbPluralForm(n) {
    if (n > 1000000) {
        return 2;
    }

    if (n > 1000 && n < 1000000 && /000$/.test(n)) {
        n /= 1000;
    }

    if ((n % 10 === 1 && n % 100 !== 11) || /1000$/.test(n.toString())) {
        return 0;
    }

    if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) {
        return 1;
    }

    return 2;
}

function getNounPluralForm(n) {
    if (n % 10 === 1 && n % 100 !== 11) {
        return 0;
    }

    if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) {
        return 1;
    }

    return 2;
}

// utils

function toCorrectForms(forms) {
    if (forms.length === 1 && Array.isArray(forms[0])) {
        return forms[0];
    }

    if (forms.length < 2) {
        throw new Error('Not enough forms');
    }

    return forms;
}

function toFormat(str, num) {
    return str.replace(/%d/g, num);
}

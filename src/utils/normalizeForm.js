export function normalizeDataForCompanyForm(data) {
    data.contacts = data.contacts.find(item => item.type === 1);
    if (!data.contacts)
        data.contacts = {
            emails: [],
            phones: [],
            websites: []
        };

    return data;
}

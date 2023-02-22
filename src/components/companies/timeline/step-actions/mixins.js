export const LetterSenderMixin = {
    computed: {
        letterMessage() {
            return `<p>С уважением, ${this.THIS_USER.userProfile.medium_name}</p><p>менеджер PLR</p>`;
        },
        sendObjectsFormdata() {
            const formdata = {
                company_id: this.currentRequest.company_id,
                subject: "Список предложений от Pennylane Realty",
                wayOfSending: [0],
                message: this.letterMessage,
            };
            if (this.defaultContactForSend !== null) {
                formdata.defaultContactForSend = {
                    contact_id: this.defaultContactForSend.contact_id,
                    id: this.defaultContactForSend.id,
                    value: this.defaultContactForSend.email,
                    type: 1,
                };
            }
            return formdata;
        },
        defaultContactForSend() {
            if (
                !this.currentRequest ||
                !this.currentRequest.contact ||
                !this.currentRequest.contact.emails ||
                !this.currentRequest.contact.emails.length
            )
                return null;
            return this.currentRequest.contact.emails[0];
        },
    }
};
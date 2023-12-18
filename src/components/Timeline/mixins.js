import TimelineStepStage from '@/components/Timeline/Step/TimelineStepStage.vue';
import ButtonList from '@/components/common/ButtonList.vue';
import { mapGetters } from 'vuex';

export const MixinStepActions = {
    components: {
        TimelineStepStage,
        ButtonList
    },
    props: {
        step: {
            type: [Object, Boolean]
        },
        disabled: {
            type: Boolean
        }
    },
    methods: {
        clickUpdateStep(data, flag, fn = null) {
            this.$emit('updateStep', data, flag, fn);
        },
        updatedObjects(data, fn) {
            this.$emit('updatedObjects', data, false, fn);
        }
    },
    emits: ['updateStep', 'updatedObjects']
};

export const MixinSteps = {
    data() {
        return {
            data: this.step
        };
    },
    components: {
        TimelineStepStage,
        ButtonList
    },
    props: {
        step: {
            type: [Object, Boolean]
        },
        disabled: {
            type: Boolean
        },

        buttons: {
            type: Array
        }
    },
    watch: {
        step() {
            this.data = this.step;
        }
    },
    emits: ['updateItem']
};

export const LetterSenderMixin = {
    computed: {
        ...mapGetters(['THIS_USER']),
        letterMessage() {
            let who = `<p>С уважением, ${this.THIS_USER.userProfile.medium_name}</p>`;
            let position = `<p>Менеджер департамента индустриальной недвижимости</p>`;
            if (this.THIS_USER.role === 4) {
                position = `<p>Директор департамента индустриальной недвижимости</p>`;
            }

            let str = `<p>`;
            if (this.THIS_USER.userProfile.phones.length) {
                str +=
                    'Моб: ' +
                    `<a href="tel:${this.THIS_USER.userProfile.phones[0].phone.replace(/\D/g, '')}">${
                        this.THIS_USER.userProfile.phones[0].phone
                    }</a> `;
            }
            str += 'тел.офис: <a href="tel:74951500323">+7 (495) 150-03-23</a>';
            if (this.THIS_USER.userProfile.caller_id) {
                str += ' доб. ' + this.THIS_USER.userProfile.caller_id;
            }

            str += '</p><p>';

            if (this.THIS_USER.userProfile.emails.length) {
                str += `Эл. почта: <a href="mailto:${this.THIS_USER.userProfile.emails[0].email}">${this.THIS_USER.userProfile.emails[0].email}</a>, `;
            }

            str += 'веб.сайт: <a href="www.industry.realtor.ru">www.industry.realtor.ru</a></p>';

            return who + position + str;
        },
        sendObjectsFormdata() {
            const formdata = {
                company_id: this.currentRequest.company_id,
                subject: 'Список предложений от Pennylane Realty',
                wayOfSending: [0],
                message: this.letterMessage
            };
            if (this.defaultContactForSend !== null) {
                formdata.defaultContactForSend = {
                    contact_id: this.defaultContactForSend.contact_id,
                    id: this.defaultContactForSend.id,
                    value: this.defaultContactForSend.email,
                    type: 1
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
        }
    }
};

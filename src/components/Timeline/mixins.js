import { mapActions, mapGetters } from 'vuex';
import { cloneObject } from '@/utils/index.js';
import api from '@/api/api.js';
import CommentWithAutoSetComment, {
    AlreadySendOffersComment,
    DONE_COMMENT_TYPE,
    OffersNotFoundComment,
    SendOffersComment
} from '@/components/Timeline/comments.js';
import { notify } from '@kyvg/vue3-notification';
import { useQueryHash } from '@/utils/useQueryHash.js';

export const TimelineStepMixin = {
    emits: ['update-step', 'updated-objects', 'next-step'],
    props: {
        step: {
            type: Object,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            data: cloneObject(this.step)
        };
    },
    computed: {
        ...mapGetters(['COMPANY_REQUESTS']),
        currentRequest() {
            if (Array.isArray(this.COMPANY_REQUESTS)) {
                return this.COMPANY_REQUESTS.find(
                    item => item.id === Number(this.$route.query.request_id)
                );
            }

            return null;
        }
    },
    watch: {
        step() {
            this.data = cloneObject(this.step);
        }
    }
};

export const TimelineStepWithObjectsMixin = {
    mixins: [TimelineStepMixin],
    data() {
        return {
            selectedObjects: [],
            preventStepObjects: [],
            isObjectsLoading: false,
            isGeneralLoading: false,
            isDefaultLoading: false,
            viewMode: true
        };
    },
    computed: {
        ...mapGetters(['TIMELINE', 'THIS_USER', 'COMPANY_CONTACTS', 'COMPANY_REQUESTS']),
        previousTimelineStepObjects() {
            if (!this.TIMELINE) return null;
            return this.TIMELINE.timelineSteps.find(item => item.number === this.step.number - 1)
                .timelineStepObjects;
        },
        submittedObjects() {
            // TODO: Изучить, всегда ли original_id уникальный. Если да, то можно возвращать не массив, а объект.
            // Ускорит вычисления в дальнейшем. Пропадет смысл пробегаться по массиву много раз.
            return this.step.timelineStepObjects.map(item => {
                if (item.offer?.id) return item.offer;
                else return { ...item, noOffer: true };
            });
        },
        notSubmittedObjects() {
            if (!this.preventStepObjects?.length) return null;

            return this.preventStepObjects.filter(
                object =>
                    !this.submittedObjects.some(
                        item => Number(item.original_id) === Number(object.original_id)
                    )
            );
        },
        submittedObjectsLabel() {
            return (
                'Выбранные предложения' +
                (this.submittedObjects?.length ? ` (${this.submittedObjects.length})` : '')
            );
        },
        notSubmittedObjectsLabel() {
            return this.submittedObjects?.length
                ? `Оставшиеся предложения (${this.notSubmittedObjects.length})`
                : '';
        },
        currentRequest() {
            if (Array.isArray(this.COMPANY_REQUESTS)) {
                return this.COMPANY_REQUESTS.find(
                    item => item.id === Number(this.$route.query.request_id)
                );
            }

            return null;
        }
    },
    watch: {
        // TODO: Подумать, нужно ли это именно тут или лучше определить его в конкретном степе
        'step.timelineStepObjects.length': {
            handler() {
                this.setPreventStepObjects();
            }
        }
    },
    methods: {
        ...mapActions(['UPDATE_STEP']),
        async alreadySent({ wayOfSending, contactForSendMessage, contacts, company_id }) {
            const sendClientFlag = false;

            const letterID = await this.realSendObjects(
                wayOfSending,
                sendClientFlag,
                contacts,
                company_id
            );

            if (!letterID) return false;

            this.step.newActionComments = [
                new AlreadySendOffersComment(
                    this.step,
                    this.selectedObjects.length,
                    contactForSendMessage,
                    wayOfSending,
                    letterID
                )
            ];

            await this.sendObjectsHandler();
            return true;
        },
        async send({
            message,
            wayOfSending,
            contactForSendMessage,
            contacts,
            subject,
            company_id
        }) {
            const sendClientFlag = true;

            const letterID = await this.realSendObjects(
                wayOfSending,
                sendClientFlag,
                contacts,
                company_id,
                message,
                subject
            );

            if (!letterID) return false;

            this.step.newActionComments = [
                this.getSendComment(
                    this.step,
                    this.selectedObjects.length,
                    contactForSendMessage,
                    wayOfSending,
                    letterID
                )
            ];

            await this.sendObjectsHandler();
            return true;
        },
        async realSendObjects(
            wayOfSending,
            sendClientFlag,
            contacts,
            company_id,
            comment = null,
            subject = null
        ) {
            this.isGeneralLoading = true;

            const objectsParams = [];
            this.selectedObjects.forEach(item => {
                objectsParams.push({
                    object_id: item.object_id,
                    original_id: item.original_id,
                    type_id: item.type_id,
                    consultant: this.THIS_USER.userProfile.full_name
                });
            });

            const isSuccessfully = await api.letter.send({
                contacts,
                shipping_method: sendClientFlag ? 1 : 0,
                offers: objectsParams,
                body: comment,
                ways: wayOfSending,
                sendClientFlag,
                subject,
                company_id
            });

            this.isGeneralLoading = false;

            if (!isSuccessfully) {
                notify({
                    group: 'app',
                    type: 'error',
                    duration: 5000,
                    title: 'Ошибка',
                    text: 'Не удалось отправить объекты!'
                });
            }

            return isSuccessfully;
        },
        getDoneComment(step) {
            return [new CommentWithAutoSetComment(step, DONE_COMMENT_TYPE)];
        },
        getNegativeComment(step) {
            return [new OffersNotFoundComment(step)];
        },
        getSendComment(...payload) {
            return new SendOffersComment(...payload);
        },
        async done() {
            this.isGeneralLoading = true;

            this.step.newActionComments = this.getDoneComment(this.step);
            await this.sendObjectsHandler();

            this.isGeneralLoading = false;
        },
        async selectNegative() {
            this.isGeneralLoading = true;

            const data = this.step;
            data.click_negative = true;
            if (data.negative) {
                data.negative = 0;
                data.newActionComments = [];
            } else {
                data.negative = 1;
                data.newActionComments = this.getNegativeComment(data);
            }

            await this.$emit('update-step', data);
            this.isGeneralLoading = false;
        },
        reset() {
            this.selectedObjects = [];
        },
        onBeforeSending(data) {
            data.negative = 0;
            data.additional = 0;
            data.status = 1;
            data.timelineStepObjects = [];
        },
        onAfterSending() {},
        normalizeObjectsData(data) {
            this.selectedObjects.map(item => {
                let price = null;

                if (item.deal_type === 1 || item.deal_type === 4) {
                    price = item.calc_price_warehouse;
                } else if (item.deal_type === 2) {
                    price = item.calc_price_sale;
                } else if (item.deal_type === 3) {
                    price = item.calc_price_safe_pallet;
                }

                data.timelineStepObjects.push({
                    timeline_step_id: data.id,
                    object_id: item.object_id,
                    offer_id: item.original_id,
                    complex_id: item.complex_id,
                    type_id: item.type_id,
                    comment: item.comment,
                    timeline_id: data.timeline_id,
                    class_name: item.class_name,
                    deal_type_name: item.deal_type_name,
                    visual_id: item.visual_id,
                    address: item.address,
                    area: item.calc_area_general,
                    price,
                    image: item.thumb
                });
            });
        },
        async sendObjectsHandler() {
            let data = cloneObject(this.step);

            await this.onBeforeSending(data);
            this.normalizeObjectsData(data);
            await this.sendObjects(data);
        },
        async sendObjects(data) {
            if (await this.UPDATE_STEP(data)) {
                await this.onAfterSending();
                await this.$emit('updated-objects', data);
                this.reset();
            }
        },
        select(object) {
            this.selectedObjects.push(object);
        },
        selectOnlyOne(object) {
            this.selectedObjects = [object];
        },
        unselect(object) {
            this.selectedObjects = this.selectedObjects.filter(item => item.id !== object.id);
        },
        addComment(objectID, comment) {
            const objectIndex = this.selectedObjects.findIndex(element => element.id === objectID);

            if (objectIndex !== -1) {
                this.selectedObjects[objectIndex].comment = comment;
                return true;
            }

            return false;
        },
        async setPreventStepObjects() {
            this.isDefaultLoading = true;

            this.preventStepObjects = this.previousTimelineStepObjects.map(element => {
                if (element.offer?.id) return element.offer;
                else return { ...element, noOffer: true };
            });

            this.isDefaultLoading = false;
        }
    },
    created() {
        this.setPreventStepObjects();
    }
};

export const TimelineStepWithSearchableObjectsMixin = {
    mixins: [TimelineStepWithObjectsMixin],
    data() {
        return {
            objects: [],
            contactsForSendingMessage: [],
            searchMode: false,
            searchParams: null,
            waitHash: null,
            pagination: null,
            currentPage: 1,
            controlPanelHeight: 0,
            isSearchLoading: false
        };
    },
    computed: {
        ...mapGetters(['FAVORITES_OFFERS', 'TIMELINE'])
    },
    methods: {
        ...mapActions(['SEARCH_FAVORITES_OFFERS']),
        async fetchObjects(query = {}, withLoader = true) {
            if (withLoader) this.isSearchLoading = true;
            query = {
                type_id: [1, 2, 3],
                page: this.currentPage,
                'per-page': 20,
                expand: 'object,offer,generalOffersMix.offer,comments',
                timeline_id: this.TIMELINE.id,
                ...query
            };

            const { setHash, confirmHash } = useQueryHash('search-favorite-offers');
            setHash(query);

            if (!this.FAVORITES_OFFERS.length) await this.SEARCH_FAVORITES_OFFERS();
            if (query.favorites) {
                query.original_id = this.FAVORITES_OFFERS.map(item => item.original_id);
                query.object_id = this.FAVORITES_OFFERS.map(item => item.object_id);
                query.complex_id = this.FAVORITES_OFFERS.map(item => item.complex_id);
            }

            const data = await api.companyObjects.searchOffers(query);

            if (confirmHash(query)) this.setObjects(data);

            if (withLoader) this.isSearchLoading = false;
        },
        async setPreventStepObjects() {
            this.isDefaultLoading = true;

            const objects = [];
            this.step.timelineStepObjects.forEach(item => {
                if (item.offer?.id) objects.push(item.offer);
                else objects.push({ ...item, noOffer: true });
            });
            this.preventStepObjects = objects;

            this.isDefaultLoading = false;
        },
        setObjects(data) {
            if (
                Array.isArray(this.objects) &&
                Array.isArray(data.data) &&
                this.searchParams?.page > 1
            )
                this.objects = this.objects.concat(data.data);
            else this.objects = data.data;

            this.pagination = data.pagination;
        },
        async search(params, withLoader = true) {
            this.searchParams = params;
            this.searchMode = true;
            await this.fetchObjects(params, withLoader);
        },
        async refresh() {
            this.searchParams.page = 1;
            await this.search(this.searchParams);
        },
        async loadMore() {
            this.nextPage();
            if (this.searchMode) await this.fetchObjects(this.searchParams);
            else await this.fetchObjects();
        },
        nextPage() {
            this.searchParams.page = this.searchParams.page ? this.searchParams.page + 1 : 2;
        },
        async fetchData() {
            await this.fetchObjects();
        }
    },
    mounted() {
        this.fetchData();
    }
};

export const TimelineStepWithLetterMixin = {
    mixins: [TimelineStepMixin],
    data() {
        return {
            sendModalIsVisible: false
        };
    },
    computed: {
        ...mapGetters(['THIS_USER']),
        letterMessage() {
            const messageAuthor = `<p>С уважением, ${this.THIS_USER.userProfile.medium_name}</p>`;
            const messageAuthorPosition = `<p>${this.THIS_USER.role === 4 ? 'Директор' : 'Менеджер'} департамента индустриальной недвижимости</p>`;

            let messageText = `<p>`;

            if (this.THIS_USER.userProfile.phones.length) {
                messageText +=
                    'Моб: ' +
                    `<a href="tel:${this.THIS_USER.userProfile.phones[0].phone.replace(/\D/g, '')}">${
                        this.THIS_USER.userProfile.phones[0].phone
                    }</a> `;
            }

            messageText += 'тел.офис: <a href="tel:74951500323">+7 (495) 150-03-23</a>';

            if (this.THIS_USER.userProfile.caller_id) {
                messageText += ' доб. ' + this.THIS_USER.userProfile.caller_id;
            }

            messageText += '</p><p>';

            if (this.THIS_USER.userProfile.emails.length) {
                messageText += `Эл. почта: <a href="mailto:${this.THIS_USER.userProfile.emails[0].email}">${this.THIS_USER.userProfile.emails[0].email}</a>, `;
            }

            messageText +=
                'веб.сайт: <a href="www.industry.realtor.ru">www.industry.realtor.ru</a></p>';

            return messageAuthor + messageAuthorPosition + messageText;
        },
        preparedLetterMessage() {
            const formData = {
                company_id: this.currentRequest?.company_id,
                subject: 'Список предложений от Pennylane Realty',
                wayOfSending: [0],
                message: this.letterMessage
            };

            if (this.defaultContactForSending !== null) {
                formData.defaultContactForSend = {
                    contact_id: this.defaultContactForSending.contact_id,
                    id: this.defaultContactForSending.id,
                    value: this.defaultContactForSending.email,
                    type: 1
                };
            }

            return formData;
        },
        defaultContactForSending() {
            if (this.currentRequest?.contact?.emails?.length)
                return this.currentRequest.contact.emails[0];
            return null;
        }
    }
};

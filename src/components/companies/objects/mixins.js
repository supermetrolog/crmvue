import api from "@/api/api";
import Objects from "./Objects.vue";
import ObjectsList from "./ObjectsList.vue";
import ObjectsControllPanel from "./ObjectsControllPanel.vue";
// import ObjectsSearch from "./ObjectsSearch.vue";
import ObjectsSearch from "@/components/offers/forms/offer-form/OfferSearchForm";
import Pagination from "@/components/common/Pagination";
import { mapActions, mapGetters } from "vuex";
import { notify } from "@kyvg/vue3-notification";
import crypto from "crypto"
export const MixinObject = {
    components: {
        Objects,
        ObjectsList,
        ObjectsControllPanel
    },
    data() {
        return {
            selectedObjects: [],
            preventStepObjects: [],
            loader: false,
            allObjectsLoader: false,
            viewMode: true,
        }
    },
    computed: {
        ...mapGetters(['TIMELINE', 'THIS_USER']),
        preventStepTimelineObjects() {
            if (!this.TIMELINE)
                return null;
            console.error('PREVENT UPDATE');
            const preventStep = this.TIMELINE.timelineSteps.find(item => item.number == (this.step.number - 1));
            return preventStep.timelineStepObjects;
        },
        buttons() {
            return [{
                    btnClass: "primary",
                    btnVisible: false,
                    disabled: !this.selectedObjects.length || this.disabled,
                    title: "Сохранить",
                    text: "Готово",
                    icon: "fas fa-check",
                    emited_event: "done",
                    withWayOfSending: false,
                    classes: "col-2",
                },
                {
                    btnClass: "danger",
                    btnVisible: false,
                    btnActive: this.step.negative,
                    disabled: this.disabled,
                    title: "В случае нахождения более подходящих предложений вам придет уведомление!",
                    text: "Нет подходящих",
                    icon: "far fa-frown-open",
                    emited_event: "negative",
                    withWayOfSending: false,
                    classes: "col-4 ml-1",
                },
            ];
        }
    },
    methods: {
        ...mapActions(['UPDATE_STEP']),
        async alreadySent({ comment, wayOfSending }) {
            console.log("SEND", comment, wayOfSending);
            const sendClientFlag = false;
            if (!this.checkContacts()) {
                return;
            }
            if (!await this.realSendObjects(wayOfSending, sendClientFlag, comment)) {
                return;
            }
            // this.realSendObjects(wayOfSending, sendClientFlag);
            this.sendObjectsHandler(comment, sendClientFlag, true);
        },
        async send({ comment, wayOfSending }) {
            console.log("SEND", comment, wayOfSending);
            const sendClientFlag = true;
            if (!this.checkContacts()) {
                return;
            }
            if (!await this.realSendObjects(wayOfSending, sendClientFlag, comment)) {
                return;
            }
            // this.realSendObjects(wayOfSending, sendClientFlag);

            this.sendObjectsHandler(comment, sendClientFlag);
        },
        async realSendObjects(wayOfSending, sendClientFlag, comment = null) {
            let notifyOptions = {
                group: "app",
                type: "error",
                duration: 5000,
                title: 'Ошибка'
            };
            if (!wayOfSending.length) {
                notifyOptions.text = 'Выберите способ отправки!';
                notify(notifyOptions);
                return false;
            }
            this.loader = true;
            this.allObjectsLoader = true;
            const objectsParams = [];
            this.selectedObjects.forEach(item => {
                objectsParams.push({
                    object_id: item.object_id,
                    original_id: item.original_id,
                    type_id: item.type_id,
                    consultant: this.THIS_USER.userProfile.full_name
                });
            });
            const isSuccessfuly = await api.timeline.sendObjects({
                contacts: this.contactForSendMessage,
                step: this.step.number,
                offers: objectsParams,
                comment,
                wayOfSending,
                sendClientFlag
            });
            this.loader = false;
            this.allObjectsLoader = false;
            console.warn(isSuccessfuly);
            if (!isSuccessfuly) {
                notifyOptions.text = 'Не удалось отправить объекты!';
                notify(notifyOptions);
                return;
            }
            return isSuccessfuly;
        },
        checkContacts() {
            if (!this.contactForSendMessage.length) {
                let notifyOptions = {
                    group: "app",
                    type: "error",
                    duration: 5000,
                    title: 'Ошибка',
                    text: 'Выберите контакт!'
                };
                notify(notifyOptions);
                return false;
            }
            return true;
        },
        done({ comment }) {
            console.log("DONE");
            this.sendObjectsHandler(comment);
        },
        negative({ comment }) {
            console.log("NEGATIVE");
            this.selectNegative(comment);
        },
        changeViewMode(value) {
            console.log("ChangeViewMode", value);
            this.viewMode = value;
        },
        reset() {
            console.log("RESET");
            this.selectedObjects = [];
        },
        selectNegative(comment) {
            let data = this.step;
            data.click_negative = true;
            console.warn(comment);
            if (data.negative) {
                data.negative = 0;
                data.newActionComments = [];
            } else {
                data.negative = 1;
                let actionComment = "Нет подходящих";
                let title = "система";
                if (comment) {
                    actionComment += ` с комментарием: <b>${comment}</b>`;
                    title += "/" + this.THIS_USER.userProfile.short_name;
                }
                data.newActionComments = [{
                    timeline_id: data.timeline_id,
                    timeline_step_id: data.id,
                    timeline_step_number: data.number,
                    title: title,
                    comment: actionComment,
                    type: 1,
                }, ];
            }
            this.clickUpdateStep(data);
        },
        beforeSend(data) {
            data.negative = 0;
            data.additional = 0;
            data.status = 1;
            data.timelineStepObjects = [];
        },

        normalizeObjectsData(data) {
            this.selectedObjects.map((item) => {
                data.timelineStepObjects.push({
                    timeline_step_id: data.id,
                    object_id: item.object_id,
                    offer_id: item.original_id,
                    complex_id: item.complex_id,
                    type_id: item.type_id,
                    comment: item.comment,
                });
            });
        },
        offerUrl(offer) {
            const baseUrl = "https://pennylane.pro/complex/";
            let url = baseUrl + offer.complex_id;
            if (offer.generalOffersMix) {
                url += "?offer_id=[" + offer.generalOffersMix.original_id + "]";
            } else {
                url += "?offer_id=[" + offer.original_id + "]";
            }
            return url;
        },
        generateComment(generalComment, sendClient, objects, data, alreadySent) {
            let objectsComments = "";
            let comment = "";
            let title = "система";
            comment = `
        <span>
          ${sendClient ? 'Отправил клиенту': 'Выбрал'} предложения (${objects.length})
        </span>
        `;
            if (alreadySent) {
                comment = `<span>Отправил предложения другим способом (${objects.length})</span>`
            }
            if (generalComment) {
                title = "система/" + this.THIS_USER.userProfile.short_name;
                comment += `с комментарием себе: <b>${generalComment}</b>`;
            }
            objects.map((object) => {
                objectsComments += `<li><a
              class="text-primary"
              href="${this.offerUrl(object)}"
              target="_blanc"
            >
              ${object.visual_id}
            </a> — 
            <b title="комментарий к объекту">
            ${object.comment ? object.comment : '-'}
           </b>
            </li>`;
            });

            if (objectsComments.length) {
                title = "система/" + this.THIS_USER.userProfile.short_name;
                comment = `${comment}<ul>${objectsComments}</ul>`;
            }
            data.newActionComments = [{
                timeline_id: data.timeline_id,
                timeline_step_id: data.id,
                timeline_step_number: data.number,
                title: title,
                comment: comment,
                type: 0,
            }, ];
        },
        sendObjectsHandler(generalComment, sendClient = false, alreadySent = false) {
            console.log(generalComment);
            let data = {
                ...this.step,
            };
            this.beforeSend(data);
            data.sendClientFlag = sendClient;
            data.contactsForSendMessage = this.contactForSendMessage;
            this.normalizeObjectsData(data);
            this.generateComment(generalComment, sendClient, this.selectedObjects, data, alreadySent);
            this.sendObjects(data);
        },
        async sendObjects(data) {
            this.loader = true;
            if (await this.UPDATE_STEP(data)) {
                this.updatedObjects(data, () => this.includeStepDataInObjectsData(this.preventStepObjects));
                this.reset();
            }
            this.loader = false;
        },
        select(object) {
            console.log("SELECT", object);
            this.selectedObjects.push(object);
        },
        selectOnlyOne(object) {
            this.selectedObjects = [object];
        },
        unSelect(object) {
            console.log("UNSELECT");
            this.selectedObjects = this.selectedObjects.filter(
                (item) => item.id != object.id
            );
        },
        addComment(object, comment) {
            console.log("ADD COMMENT", object, comment);
            this.selectedObjects.map((item) => {
                if (item.id == object.id) {
                    item.comment = comment;
                    return item;
                }
            });
            console.log("ADD COMMENT", this.selectedObjects);

        },
        async getPreventStepObjects() {
            this.loader = true;
            // const uniqueObject = [];
            // this.preventStepTimelineObjects.forEach(item => {
            //     uniqueObject.push(JSON.stringify({ object_id: item.object_id, type_id: item.type_id }));
            // });
            // const response = await api.companyObjects.searchOffers({
            //     expand: 'object,miniOffersMix',
            //     uniqueOffer: uniqueObject
            // });
            // console.log(response);
            // const objects = await api.objects.getCurrentStepObjectsOneByOne(
            //     this.preventStepTimelineObjects
            // );
            const objects = [];
            this.preventStepTimelineObjects.forEach(item => {
                if (item.offer) {
                    objects.push(item.offer);
                }
            });
            this.includeStepDataInObjectsData(objects);
            this.preventStepObjects = objects;
            this.loader = false;
        },
        includeStepDataInObjectsData(data) {
            console.error("data", data);
            if (!this.TIMELINE) return data;

            this.step.timelineStepObjects.forEach((item) => {
                let comments = [];
                this.TIMELINE.timelineSteps.forEach(step => {
                    let result = step.timelineStepObjects.find(thisObject => thisObject.object_id == item.object_id);
                    if (result && result.comments.length) {
                        comments.push(...result.comments);
                    }
                });
                data.map((object) => {
                    if (item.object_id == object.original_id) {
                        object.duplicate_count = item.duplicate_count;
                        object.comments = item.comments;
                        object.allComments = comments;
                        // object.comment = item.comment;
                        return object;
                    }
                });
            });
            return data;
        },
    },
    mounted() {
        this.getPreventStepObjects();
    },
};

export const MixinAllObject = {
    mixins: [MixinObject],
    components: {
        ObjectsSearch,
        Pagination
    },
    data() {
        return {
            allObjects: [],
            currentPage: 1,
            pagination: null,
            searchMode: false,
            searchParams: null,
            allObjectsLoader: false,
            controllPanelHeight: 0,
            barVisible: false,
            waitHash: null
        };
    },
    computed: {
        ...mapGetters(["COMPANY_REQUESTS", "FAVORITES_OFFERS"]),
        buttons() {
            return [{
                    btnClass: "success",
                    btnVisible: false,
                    disabled: !this.selectedObjects.length || this.disabled,
                    title: "Отправить презентации с объектами клиенту",
                    text: "Отправить",
                    icon: "fas fa-paper-plane",
                    emited_event: "send",
                    withWayOfSending: true,
                    classes: "col-2",
                },
                {
                    btnClass: "primary",
                    btnVisible: false,
                    disabled: !this.selectedObjects.length || this.disabled,
                    title: "Уже отправил предложения другим способом",
                    text: "Уже отправил",
                    icon: "fas fa-paper-plane",
                    emited_event: "alreadySent",
                    withWayOfSending: true,
                    classes: "col-3 ml-1",
                },
                {
                    btnClass: "danger",
                    btnVisible: false,
                    btnActive: this.step.negative,
                    disabled: this.disabled,
                    title: "Отправить презентации с объектами клиенту",
                    text: "Нет подходящих",
                    icon: "far fa-frown-open",
                    emited_event: "negative",
                    withWayOfSending: false,
                    classes: "col-3 ml-1",
                },
                {
                    btnClass: "primary",
                    btnVisible: false,
                    defaultBtn: true,
                    disabled: this.disabled,
                    title: "Выбранные предложения",
                    text: `Избранные (${this.selectedObjects.length})`,
                    icon: "fas fa-bookmark",
                    emited_event: "favorites",
                    withWayOfSending: false,
                    classes: "col-3 ml-1",
                },
            ];
        },
        currentRequest() {
            if (Array.isArray(this.COMPANY_REQUESTS)) {
                return this.COMPANY_REQUESTS.find(
                    (item) => item.id == this.$route.query.request_id
                );
            }
            return false;
        },
    },
    methods: {
        ...mapActions(["SEARCH_FAVORITES_OFFERS"]),
        async getAllObjects(query = {}, withLoader = true) {
            this.allObjectsLoader = withLoader;
            let hash = crypto.createHash('sha256').update(JSON.stringify(query)).digest('base64');
            this.waitHash = hash;
            query = {
                type_id: [1, 2, 3],
                page: this.currentPage,
                'per-page': 20,
                expand: 'object,offer,generalOffersMix.offer,comments',
                ...query
            };
            if (!this.FAVORITES_OFFERS.length) {
                await this.SEARCH_FAVORITES_OFFERS();
            }
            if (query.favorites) {
                query.original_id = this.FAVORITES_OFFERS.map(
                    (item) => item.original_id
                );
                query.object_id = this.FAVORITES_OFFERS.map((item) => item.object_id);
                query.complex_id = this.FAVORITES_OFFERS.map((item) => item.complex_id);
            }
            const data = await api.companyObjects.searchOffers(query);



            if (hash == this.waitHash) {
                this.includeStepDataInObjectsData(data.data);
                this.setAllObjects(data);
            }
            this.allObjectsLoader = false;
        },
        async getPreventStepObjects() {
            this.loader = true;
            const objects = [];
            this.step.timelineStepObjects.forEach(item => {
                if (item.offer) {
                    objects.push(item.offer);
                }
            });
            this.includeStepDataInObjectsData(objects);
            this.preventStepObjects = objects;
            this.loader = false;
        },
        setAllObjects(data) {
            if (
                Array.isArray(this.allObjects) &&
                Array.isArray(data.data) &&
                this.currentPage > 1
            ) {
                this.allObjects = this.allObjects.concat(data.data);
            } else {
                this.allObjects = data.data;
            }

            this.pagination = data.pagination;
        },
        async search(params, withLoader = true) {
            this.searchParams = params;
            this.searchMode = true;
            this.returnCurrentPageToFirst();
            this.getAllObjects(params, withLoader);
        },
        async searchAllObjects(params) {
            this.allObjectsLoader = true;
            // if (params.query.searchText == "") {
            //     this.searchMode = false;
            //     await this.getAllObjects();
            // } else {
            //     const search = params.query.searchText;
            //     const queryParams = {
            //         search,
            //         pages: 1,
            //         page_num: this.currentPage,
            //         page_items: 32,
            //     };
            //     const data = await api.objects.searchObjects(queryParams);
            //     this.includeStepDataInObjectsData(data.offers);
            //     this.setAllObjects(data);
            // }
            await this.getAllObjects(params);
            this.allObjectsLoader = false;
        },
        loadMore() {
            this.incrimentCurrentPage();
            if (this.searchMode) {
                this.searchAllObjects(this.searchParams);
            } else {
                this.getAllObjects();
            }
        },
        incrimentCurrentPage() {
            this.currentPage++;
            if (this.searchParams && this.searchParams.page) {
                this.searchParams.page++;
            }
        },
        returnCurrentPageToFirst() {
            this.currentPage = 1;
        },
        favorites() {
            this.barVisible = !this.barVisible;
        },
        getData() {
            this.getAllObjects();
        }
    },
    mounted() {
        this.getData();
    },
}
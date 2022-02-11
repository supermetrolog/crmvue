import api from "@/api/api";
import Objects from "./Objects.vue";
import ObjectsList from "./ObjectsList.vue";
import ObjectsControllPanel from "./ObjectsControllPanel.vue";
import ObjectsSearch from "./ObjectsSearch.vue";
import Pagination from "@/components/Pagination";
import { mapGetters } from "vuex";
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
            viewMode: true,

        }
    },
    computed: {
        ...mapGetters(['TIMELINE']),
        preventStepTimelineObjects() {
            if (!this.TIMELINE)
                return null;

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
                    icon: "fas fa-paper-plane",
                    emited_event: "send",
                    classes: "col-2",
                },
                {
                    btnClass: "danger",
                    btnVisible: false,
                    disabled: this.disabled,
                    title: "В случае нахождения более подходящих предложений вам придет уведомление!",
                    text: "Нет подходящих",
                    icon: "far fa-frown-open",
                    emited_event: "negative",
                    classes: "col-4 ml-1",
                },
            ];
        }
    },
    methods: {
        send() {
            console.log("SEND");
        },
        done() {
            console.log("DONE");
        },
        negative() {
            console.log("NEGATIVE");
        },
        changeViewMode(value) {
            console.log("ChangeViewMode");
            this.viewMode = value;
        },
        reset() {
            console.log("RESET");
            this.selectedObjects = [];
        },
        select(object) {
            console.log("SELECT", object);
            this.selectedObjects.push(object);
        },
        unSelect(object) {
            console.log("UNSELECT");
            this.selectedObjects = this.selectedObjects.filter(
                (item) => item.id != object.id
            );
        },
        addComment(object, comment) {
            console.log("ADD COMMENT");
            this.selectedObjects.map((item) => {
                if (item.id == object.id) {
                    item.comment = comment;
                    return item;
                }
            });
        },
        async getPreventStepObjects() {
            this.loader = true;
            const objects = await api.objects.getCurrentStepObjectsOneByOne(
                this.preventStepTimelineObjects
            );
            this.includeStepDataInObjectsData(objects);
            this.preventStepObjects = objects;
            this.loader = false;
        },
        includeStepDataInObjectsData(data) {
            this.step.timelineStepObjects.forEach((item) => {
                data.map((object) => {
                    if (item.object_id == object.original_id) {
                        object.duplicate_count = item.duplicate_count;
                        object.comment = item.comment;
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
            allObjectsLoader: false,
        };
    },
    computed: {
        buttons() {
            return [{
                    btnClass: "success",
                    btnVisible: false,
                    disabled: !this.selectedObjects.length || this.disabled,
                    title: "Отправить презентации с объектами клиенту",
                    text: "Отправить",
                    icon: "fas fa-paper-plane",
                    emited_event: "send",
                    classes: "col-2",
                },
                {
                    btnClass: "danger",
                    btnVisible: false,
                    disabled: this.disabled,
                    title: "Отправить презентации с объектами клиенту",
                    text: "Нет подходящих",
                    icon: "far fa-frown-open",
                    emited_event: "negative",
                    classes: "col-4 ml-1",
                },
            ];
        }
    },
    methods: {
        async getAllObjects() {
            this.allObjectsLoader = true;
            const data = await api.objects.getAllObjects(this.currentPage);
            this.includeStepDataInObjectsData(data.offers);
            this.setAllObjects(data);
            this.allObjectsLoader = false;
        },
        async getPreventStepObjects() {
            this.loader = true;
            const objects = await api.objects.getCurrentStepObjectsOneByOne(
                this.step.timelineStepObjects
            );
            this.includeStepDataInObjectsData(objects);
            this.preventStepObjects = objects;
            this.loader = false;
        },
        setAllObjects(data) {
            if (
                Array.isArray(this.allObjects) &&
                Array.isArray(data.offers) &&
                this.currentPage > 1
            ) {
                this.allObjects = this.allObjects.concat(data.offers);
            } else {
                this.allObjects = data.offers;
            }

            this.pagination = data.pagination;
        },
        async search(params) {
            this.searchParams = params;
            this.searchMode = true;
            this.returnCurrentPageToFirst();
            this.searchAllObjects(params);
        },
        async searchAllObjects(params) {
            this.allObjectsLoader = true;
            if (params.query.searchText == "") {
                this.searchMode = false;
                await this.getAllObjects();
            } else {
                const search = params.query.searchText;
                const queryParams = {
                    search,
                    pages: 1,
                    page_num: this.currentPage,
                    page_items: 32,
                };
                const data = await api.objects.searchObjects(queryParams);
                this.includeStepDataInObjectsData(data.offers);
                this.setAllObjects(data);
            }
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
        },
        returnCurrentPageToFirst() {
            this.currentPage = 1;
        },
    },
    mounted() {
        this.getAllObjects();
    },
}
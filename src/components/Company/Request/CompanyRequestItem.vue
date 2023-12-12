<template>
    <div
        class="row item mb-2"
        :class="{
      done: request.status == 2,
      active: request.status == 1,
      selected: $route.query.selected_request == request.id && !reedOnly,
    }"
        @click="clickOnItem"
    >
        <div class="col-12 text-center general-info py-2">
            <div class="header">
                <div class="text-center mb-1" v-if="!request.status">
                    <h3 class="text-warning">Пассив!</h3>
                    <p class="text-dark normal">
                        <b>{{ passiveWhyOptions[request.passive_why].label }}</b>
                    </p>
                    <p class="text-dark d-block normal">
                        {{ request.passive_why_comment }}
                    </p>
                    <hr/>
                </div>
                <i
                    class="fas fa-pen text-primary edit"
                    @click="openCompanyRequestFormForUpdate"
                    v-if="!reedOnly && request.status != 2"
                ></i>
                <!-- <i
                  class="fas fa-pen text-primary edit"
                  @click="openCompanyRequestFormForUpdate"
                  v-if="!reedOnly"
                ></i> -->
                <i
                    class="fas fa-clone text-dark clone"
                    @click="cloneRequest"
                    v-if="!reedOnly && !editOnly"
                    title="Клонировать"
                ></i>
                <!-- <i
                  class="fas fa-times text-danger delete"
                  @click="deleteRequest"
                  v-if="!reedOnly && request.status != 2"
                ></i> -->
                <p>{{ dealType }} {{ request.minArea + " - " + request.maxArea }}</p>
                <span>
          м<sup><small>2</small></sup>
        </span>
            </div>
            <div class="body mt-1">
                <div class="main-info">
                    <div class="location">
                        <div class="region">
                            <strong>
                                {{
                                    request.regions
                                        .map((elem) =>
                                            this.$formatter.text().ucFirst(elem.info.title)
                                        )
                                        .join(", ")
                                }}
                            </strong>
                        </div>
                        <div class="region-parameters" v-if="request.directions.length">
                            <p class="d-block"><b>Московская область:</b></p>
                            <p>
                                {{
                                    request.directions
                                        .map((elem) => this.directionList[elem.direction][2])
                                        .join(", ")
                                }}
                            </p>
                        </div>
                        <div class="region-parameters" v-if="request.districts.length">
                            <p class="d-block"><b>Москва:</b></p>
                            <p>
                                {{
                                    request.districts
                                        .map((elem) => this.districtList[elem.district][1])
                                        .join(", ")
                                }}
                            </p>
                        </div>
                        <div>
                            <p v-if="!request.distanceFromMKADnotApplicable">
                                до {{ request.distanceFromMKAD }} км до МКАД
                            </p>
                        </div>
                    </div>
                    <strong class="text-danger" v-if="request.expressRequest"
                    >Срочный запрос</strong
                    >
                </div>
                <i
                    class="
            far
            fa-arrow-alt-circle-down
            d-block
            open-extra-info
            mt-1
            scale
          "
                    @click="openExtraInfo"
                    v-if="!extraInfoVisible"
                ></i>
                <i
                    class="far fa-arrow-alt-circle-up d-block open-extra-info mt-1 scale"
                    @click="closeExtraInfo"
                    v-if="extraInfoVisible"
                ></i>
                <div class="extra-info" v-if="extraInfoVisible">
                    <hr/>
                    <div class="row parameters">
                        <div class="col-6">
                            <p>отапливаемый</p>
                            <p class="parameters-inner">
                                {{ request.heated ? "да" : "нет" }}
                            </p>
                            <p>краны</p>
                            <p class="parameters-inner">
                                {{ request.haveCranes ? "есть" : "нет" }}
                            </p>
                            <p>только антипыль</p>
                            <p class="parameters-inner">
                                {{ request.antiDustOnly ? "да" : "нет" }}
                            </p>
                            <p>высота потолков <small class="text-grey">(м)</small></p>
                            <p class="parameters-inner">
                                {{ request.format_ceilingHeight }}
                            </p>
                            <p>
                                площадь пола <small class="text-grey">(м<sup>2</sup>)</small>
                            </p>
                            <p class="parameters-inner">
                                {{ request.minArea + " - " + request.maxArea }}
                            </p>
                            <p>классы</p>
                            <div class="parameters-inner">
                                <p>
                                    {{
                                        request.objectClasses
                                            .map((elem) => this.objectClassList[elem.object_class][1])
                                            .join(", ")
                                    }}
                                </p>
                                <p v-if="!request.objectClasses.length">нет данных</p>
                            </div>
                            <p>тип объекта</p>
                            <div class="parameters-inner" v-if="request.objectTypes">
                                <p
                                    v-for="objectType of request.objectTypes"
                                    :key="objectType.id"
                                    :title="getObjectTypeName(objectType.object_type)"
                                >
                                    <i :class="getObjectTypeIcon(objectType.object_type)"></i>
                                </p>
                                <p v-if="!request.objectTypes.length">нет данных</p>
                            </div>
                        </div>
                        <div class="col-6">
                            <p>только 1-й этаж</p>
                            <p class="parameters-inner">
                                {{ request.firstFloorOnly ? "да" : "нет" }}
                            </p>
                            <p>ж/д ветка</p>
                            <p class="parameters-inner">
                                {{ request.trainLine ? "есть" : "нет" }}
                            </p>
                            <p v-if="request.trainLine">
                                длина ж/д ветки <small class="text-grey">(м)</small>
                            </p>
                            <p class="parameters-inner" v-if="request.trainLine">
                                {{ request.trainLineLength ?? "нет данных" }}
                            </p>
                            <p>дата переезда</p>
                            <p class="parameters-inner" v-if="request.movingDate">
                                {{ request.movingDate_format }}
                            </p>
                            <p
                                class="parameters-inner"
                                v-if="request.unknownMovingDate !== null"
                            >
                                {{ unknownMovingDateOptions[request.unknownMovingDate][1] }}
                            </p>

                            <p>цена пола <small class="text-grey">(р)</small></p>
                            <p class="parameters-inner">
                                {{ request.pricePerFloor ?? "нет данных" }}
                            </p>
                            <p>электричество <small class="text-grey">(кВт)</small></p>
                            <p class="parameters-inner">
                                {{ request.electricity ?? "нет данных" }}
                            </p>
                            <p class="font-weight-bold">ворота</p>
                            <div class="parameters-inner">
                                <p v-if="!request.gateTypes.length">нет данных</p>
                                <p v-else>
                                    {{
                                        request.gateTypes
                                            .map((elem) => this.gateTypeList[elem.gate_type][1])
                                            .join(", ")
                                    }}
                                </p>
                            </div>
                        </div>
                        <div class="col-12 mt-2">
                            <p>Описание</p>
                            <p class="parameters-inner">
                                {{ request.description ?? "нет данных" }}
                            </p>
                        </div>
                    </div>
                </div>
                <Progress
                    class="mt-2"
                    :percent="request.timeline_progress"
                    title="Обработано"
                />
            </div>
            <div class="footer row mt-1">
                <div class="col-8 consultant text-left">
                    <p>конс: {{ request.consultant.userProfile.short_name }}</p>
                    <p>{{ request.created_at_format }}</p>
                </div>
                <div class="col-4 date text-right" v-if="!reedOnly">
                    <button
                        class="btn px-2 btn-primary scale timeline-btn"
                        @click="clickTimeline"
                    >
                        таймлайн
                    </button>
                </div>
            </div>
        </div>
        <div class="col-12 deal-info py-2" v-if="request.deal && withDeal">
            <DealListItem :deal="request.deal" :reedOnly="true"/>
        </div>
    </div>
</template>

<script>
import {
    ObjectClassList,
    GateTypeList,
    ObjectTypeList,
    RegionList,
    DirectionList,
    DistrictList,
    DealTypeList,
    PassiveWhyRequest,
    unknownMovingDate,
} from "@/const/const.js";
import Progress from "@/components/common/Progress.vue";
import {mapGetters} from "vuex";
import DealListItem from "@/components/Deal/DealListItem.vue";

export default {
    name: "CompanyRequestItem",
    components: {
        DealListItem,
        Progress
    },
    data() {
        return {
            objectClassList: ObjectClassList.get("param"),
            gateTypeList: GateTypeList.get("param"),
            objectTypeListWareHouse: ObjectTypeList.get("warehouse"),
            objectTypeListProduction: ObjectTypeList.get("production"),
            objectTypeListPlot: ObjectTypeList.get("plot"),
            regionList: RegionList.get("param"),
            directionList: DirectionList.get("param"),
            districtList: DistrictList.get("param"),
            dealTypeList: DealTypeList.get("param"),
            passiveWhyOptions: PassiveWhyRequest.get("param"),
            unknownMovingDateOptions: unknownMovingDate.get("param"),
            extraInfoVisible: false,
        };
    },
    props: {
        request: {
            type: Object,
        },
        reedOnly: {
            type: Boolean,
            default: false,
        },
        editOnly: {
            type: Boolean,
            default: false,
        },
        withDeal: {
            type: Boolean,
            default: true,
        },
    },
    computed: {
        ...mapGetters(["THIS_USER"]),
        dealType() {
            return this.dealTypeList[this.request.dealType].label;
        },
    },
    methods: {
        openCompanyRequestFormForUpdate() {
            this.$emit("openCompanyRequestFormForUpdate", this.request);
        },
        deleteRequest() {
            this.$emit("deleteRequest", this.request);
        },
        cloneRequest() {
            let data = {
                ...this.request,
            };
            delete data.id;
            delete data.created_at;
            delete data.updated_at;
            data.status = data.status == 2 ? 1 : data.status;
            this.$emit("cloneRequest", data);
        },
        openExtraInfo() {
            this.extraInfoVisible = true;
        },
        closeExtraInfo() {
            this.extraInfoVisible = false;
        },
        clickTimeline() {
            this.$router.push({
                query: {
                    request_id: this.request.id,
                    consultant_id: this.THIS_USER.id,
                    step: 0,
                },
            });
        },
        getObjectTypeIcon(objectType) {
            if (objectType < 12) {
                return this.objectTypeListWareHouse.find(
                    (item) => item[0] == objectType
                )[1].icon;
            }
            if (objectType < 25) {
                return this.objectTypeListProduction.find(
                    (item) => item[0] == objectType
                )[1].icon;
            }
            return this.objectTypeListPlot.find((item) => item[0] == objectType)[1]
                .icon;
        },
        getObjectTypeName(objectType) {
            if (objectType < 12) {
                return this.objectTypeListWareHouse.find(
                    (item) => item[0] == objectType
                )[1].name;
            }
            if (objectType < 25) {
                return this.objectTypeListProduction.find(
                    (item) => item[0] == objectType
                )[1].name;
            }
            return this.objectTypeListPlot.find((item) => item[0] == objectType)[1]
                .name;
        },
        clickOnItem(event) {
            if (
                this.reedOnly ||
                ["I", "BUTTON", "A"].includes(event.target.tagName)
            ) {
                return;
            }

            const query = {...this.$route.query};
            if (query.selected_request && query.selected_request == this.request.id) {
                delete query.selected_request;
            } else {
                query.selected_request = this.request.id;
            }

            this.$router.replace({query});
        },
    },
    mounted() {
        this.extraInfoVisible = this.reedOnly;
    },
    emits: ["openCompanyRequestFormForUpdate", "deleteRequest", "cloneRequest"],
};
</script>

<style>
</style>
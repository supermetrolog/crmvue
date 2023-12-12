<template>
    <teleport to="body">
        <transition
            mode="out-in"
            enter-active-class="animate__animated animate__zoomIn for__modal absolute"
            leave-active-class="animate__animated animate__zoomOut for__modal absolute"
        >
            <FormModalCompanyRequestClone
                v-if="clonedRequestItem"
                :request="clonedRequestItem"
                @close="clickCloseModal"
                @cloned="clonedRequest"
            />
        </transition
        >
    </teleport>
    <FormModalCompanyRequestDisable
        v-if="disabledRequestItem"
        :request_id="disabledRequestItem.id"
        @close="closeDisableForm"
        @disabled="onRequestIsDisabled"
    />
    <CompanyBoxLayout class="CompanyBoxRequests" :class="'grid-d'">
        <template #header>
            <div class="CompanyBoxRequests-header">
        <span
        >ЗАПРОСЫ ({{ requests.length }}), СДЕЛКИ ({{
                dealsCount + deals.length
            }})</span
        ><small class="edit_btn" @click="clickCreateRequest"> [создать]</small>
            </div>
        </template>
        <template #content>
            <CompanyBoxRequestsList
                :requests="requests"
                @clickUpdateRequest="openCompanyRequestFormForUpdate"
                @clickCloneRequest="clickCloneRequest"
                @clickDisableRequest="clickDisableRequest"
            />
            <template v-if="deals.length">
                <DealList
                    :deals="deals"
                    @openDealFormForUpdate="openDealFormForUpdate"
                    @deleted="dealDeleted"
                />
            </template>
            <NoData v-if="!requests.length"/>
        </template>
    </CompanyBoxLayout>
</template>

<script>
import {mapActions} from "vuex";
import api from "@/api/api";
import NoData from "@/components/common/NoData.vue";
import CompanyBoxRequestsList from "@/components/Company/Box/CompanyBoxRequestsList.vue";
import DealList from "@/components/Deal/DealList.vue";
import CompanyBoxLayout from "@/components/Company/Box/CompanyBoxLayout.vue";
import FormModalCompanyRequestClone from "@/components/forms/templates/Company/FormModalCompanyRequestClone.vue";
import FormModalCompanyRequestDisable from "@/components/forms/templates/Company/FormModalCompanyRequestDisable.vue";

export default {
    name: "CompanyBoxRequests",
    components: {
        FormModalCompanyRequestDisable,
        FormModalCompanyRequestClone,
        CompanyBoxLayout,
        DealList,
        CompanyBoxRequestsList,
        NoData
    },
    props: {
        requests: {
            type: Array,
            default: () => [],
        },
        deals: {
            type: Array,
            default: () => [],
        },
        loading: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            disabledRequestItem: null,
            clonedRequestItem: null,
            loader: false,
        };
    },
    computed: {
        dealsCount() {
            const requestsWithDeal = this.requests.filter(
                (item) => item.deal != null
            );
            if (Array.isArray(requestsWithDeal)) {
                return requestsWithDeal.length;
            }
            return 0;
        },
    },
    methods: {
        ...mapActions(["CREATE_REQUEST"]),
        openDealFormForUpdate(deal) {
            this.$emit("openDealFormForUpdate", deal);
        },
        dealDeleted() {
            this.$emit("dealDeleted");
        },
        clickCreateRequest() {
            this.$emit("clickCreateRequest");
        },
        openCompanyRequestFormForUpdate(request) {
            this.$emit("openCompanyRequestFormForUpdate", request);
        },
        clickCloseModal() {
            this.disabledRequestItem = null;
            this.clonedRequestItem = null;
        },
        async clickDisableRequest(request) {
            if (request.status == 0) {
                if (await api.request.undisable(request.id)) {
                    this.onRequestIsDisabled();
                }
            } else {
                this.disabledRequestItem = request;
            }
        },
        closeDisableForm() {
            this.disabledRequestItem = null;
        },
        clickCloneRequest(request) {
            this.clonedRequestItem = request;
        },
        async clonedRequest() {
            this.clickCloseModal();
            this.$emit("requestCloned");
        },
        onRequestIsDisabled() {
            this.disabledRequestItem = null;
            this.$emit("requestDisabled");
        },
    },
    mounted() {
    },
    emits: [
        "clickCreateRequest",
        "openCompanyRequestFormForUpdate",
        "requestCloned",
        "requestDisabled",
        "openDealFormForUpdate",
        "dealDeleted",
    ],
};
</script>
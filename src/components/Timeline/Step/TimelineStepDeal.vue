<template>
    <div class="col-12 mb-2 px-0">
        <teleport to="body">
            <FormCompanyDeal
                v-if="data && dealFormVisible"
                @close="clickCloseDealForm"
                @created="updateItem"
                @updated="updateItem"
                :formdata="currentRequest.deal"
                :company_id="currentRequest.company_id"
                :request_id="currentRequest.id"
                :deal-type="currentRequest.dealType"
                :object_id="data.timelineStepObjects[0].offer.object_id"
                :complex_id="data.timelineStepObjects[0].offer.complex_id"
                :type_id="data.timelineStepObjects[0].offer.type_id"
                :original_id="data.timelineStepObjects[0].offer.original_id"
                :visual_id="data.timelineStepObjects[0].offer.visual_id"
                :is-our-deal="true"
            />
        </teleport>
        <TimelineStepStage
            class="mb-2"
            title="Шаг 1. Выбрать объект, по которому произошла сделка"
            :is-done="!!data.timelineStepObjects.length"
            :close-slot-when-done="!!currentRequest.deal"
            :is-current="!data.timelineStepObjects.length"
        >
            <ButtonList @done="$emit('done')" @negative="$emit('negative')" :buttons="buttons" />
        </TimelineStepStage>
        <TimelineStepStage
            class="mb-2"
            title="Шаг 2. заполнить данные по сделке"
            :is-done="!!currentRequest.deal"
            :is-current="!!data.timelineStepObjects.length"
        >
            <Loader v-if="loader" class="center" />
            <button @click="clickOpenDealForm" class="btn btn-primary" :disabled="disabled">
                Создать сделку
            </button>
        </TimelineStepStage>
        <div v-if="currentRequest.deal" class="row mt-3">
            <div class="col-5 mx-auto">
                <DealListItem :deal="currentRequest.deal" reed-only />
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Loader from '@/components/common/Loader.vue';
import FormCompanyDeal from '@/components/Forms/Company/FormCompanyDeal.vue';
import { MixinSteps } from '@/components/Timeline/mixins.js';
import DealListItem from '@/components/Deal/DealListItem.vue';

export default {
    name: 'TimelineStepDeal',
    components: {
        DealListItem,
        FormCompanyDeal,
        Loader
    },
    mixins: [MixinSteps],
    props: {
        request_id: {
            type: Number
        },
        loaderForStep: {
            type: [Number, Boolean]
        }
    },
    data() {
        return {
            loader: this.loaderForStep,
            dealFormVisible: false
        };
    },
    computed: {
        ...mapGetters(['CONSULTANT_LIST', 'COMPANY_REQUESTS']),
        currentRequest() {
            return this.COMPANY_REQUESTS.find(item => item.id == this.request_id);
        }
    },
    watch: {
        loaderForStep() {
            this.loader = this.loaderForStep;
        }
    },
    methods: {
        ...mapActions(['FETCH_COMPANY_REQUESTS']),
        clickOpenDealForm() {
            this.dealFormVisible = true;
        },
        clickCloseDealForm() {
            this.dealFormVisible = false;
        },
        updateItem(form) {
            this.data.deal = form;
            this.data.status = 1;
            this.$emit('updateItem', this.data, false, () => {
                this.FETCH_COMPANY_REQUESTS(this.$route.params.id);
            });
        }
    },
    async mounted() {}
};
</script>

<style></style>

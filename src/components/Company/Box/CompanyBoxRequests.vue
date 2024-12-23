<template>
    <CompanyBoxLayout>
        <template #header>
            <div class="d-flex align-items-center gap-2">
                <span>
                    ЗАПРОСЫ ({{ requests.length }}), СДЕЛКИ ({{ dealsCount + deals.length }})
                </span>
                <HoverActionsButton @click="$emit('create-request')" small label="Создать запрос">
                    <i class="fa-solid fa-plus" />
                </HoverActionsButton>
            </div>
        </template>
        <template #content>
            <CompanyBoxRequestsList
                v-if="requests.length"
                @update="$emit('update-request', $event)"
                @clone="clonedRequestItem = $event"
                @disable="disableRequest"
                :requests="requests"
            />
            <DealList
                v-if="deals.length"
                @update="$emit('update-deal', $event)"
                @deleted="$emit('deal-deleted')"
                :deals="deals"
            />
            <div v-if="!requests.length && !deals.length" class="company-box-empty">
                <EmptyData class="company-box-empty__data">Нет данных</EmptyData>
            </div>
            <teleport to="body">
                <FormModalCompanyRequestDisable
                    @close="disabledRequestItem = null"
                    @disabled="onRequestIsDisabled"
                    :show="disabledRequestItem"
                    :request_id="disabledRequestItem?.id"
                />
                <FormModalCompanyRequestClone
                    v-if="!!clonedRequestItem"
                    @close="closeModal"
                    @cloned="onRequestCloned"
                    :request="clonedRequestItem"
                />
            </teleport>
        </template>
    </CompanyBoxLayout>
</template>

<script>
import api from '@/api/api';
import CompanyBoxRequestsList from '@/components/Company/Box/CompanyBoxRequestsList.vue';
import DealList from '@/components/Deal/DealList.vue';
import CompanyBoxLayout from '@/components/Company/Box/CompanyBoxLayout.vue';
import FormModalCompanyRequestClone from '@/components/Forms/Company/FormModalCompanyRequestClone.vue';
import FormModalCompanyRequestDisable from '@/components/Forms/Company/FormModalCompanyRequestDisable.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import EmptyData from '@/components/common/EmptyData.vue';

export default {
    name: 'CompanyBoxRequests',
    components: {
        EmptyData,
        HoverActionsButton,
        FormModalCompanyRequestDisable,
        FormModalCompanyRequestClone,
        CompanyBoxLayout,
        DealList,
        CompanyBoxRequestsList
    },
    emits: [
        'update-deal',
        'deal-deleted',
        'create-request',
        'update-request',
        'request-cloned',
        'request-disabled'
    ],
    props: {
        requests: {
            type: Array,
            default: () => []
        },
        deals: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            disabledRequestItem: null,
            clonedRequestItem: null
        };
    },
    computed: {
        dealsCount() {
            return this.requests.filter(item => item.deal !== null).length;
        }
    },
    methods: {
        closeModal() {
            this.disabledRequestItem = null;
            this.clonedRequestItem = null;
        },
        async disableRequest(request) {
            if (request.status === 0) {
                if (await api.request.undisable(request.id)) {
                    this.onRequestIsDisabled();
                }
            } else this.disabledRequestItem = request;
        },
        onRequestCloned() {
            this.closeModal();
            this.$emit('request-cloned');
        },
        onRequestIsDisabled() {
            this.disabledRequestItem = null;
            this.$emit('request-disabled');
        }
    }
};
</script>

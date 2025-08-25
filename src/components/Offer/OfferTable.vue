<template>
    <Table fluid shadow class="offer-table" :refreshing>
        <template #thead>
            <Tr>
                <Th>#</Th>
                <Th>Объект</Th>
                <Th>регион</Th>
                <Th :sort="sortable ? 'from_mkad' : null">мкад</Th>
                <Th :sort="sortable ? 'area' : null">площадь</Th>
                <Th
                    v-model:filters="priceFilters"
                    @confirm-filter="confirmPriceFilters"
                    :sort="sortable ? 'price' : null"
                >
                    <template #default>цена</template>
                    <template #filter>
                        <UiForm>
                            <UiFormGroup>
                                <DoubleInput
                                    v-model:first="priceFilters.rangeMinPricePerFloor"
                                    v-model:second="priceFilters.rangeMaxPricePerFloor"
                                    label="Цена (продажи, аренды, о-х)"
                                    class="col-12"
                                    unit="₽"
                                    type="number"
                                />
                            </UiFormGroup>
                        </UiForm>
                    </template>
                </Th>
                <Th>cобственник</Th>
                <Th v-model:filters="consultantFilters" @confirm-filter="confirmConsultantFilters">
                    <template #default>консультант</template>
                    <template #filter>
                        <div class="row">
                            <Spinner v-if="consultantsIsLoading" small center />
                            <ConsultantPicker
                                v-else
                                v-model="consultantFilters.consultant_id"
                                :options="getConsultantsOptions"
                                class="col-12"
                                :append-to-body="false"
                            />
                        </div>
                    </template>
                </Th>
                <Th>реклама</Th>
                <Th :sort="sortable ? 'last_update' : null">обновление</Th>
            </Tr>
        </template>
        <template #tbody>
            <Loader v-if="loader && offers.length" />
            <template v-else-if="loader">
                <OfferTableItemSkeleton v-for="item in 5" :key="item" />
            </template>
            <OfferTableItem
                v-for="offer in offers"
                :key="offer.id"
                @show-complex-objects="$emit('show-complex-objects', offer.complex_id)"
                @favorite-deleted="$emit('favorite-deleted')"
                @deleted-from-folder="$emit('deleted-from-folder', offer.id, $event)"
                @show-map="$emit('show-map', offer)"
                @create-task="$emit('create-task', offer)"
                :offer="offer"
                :loader="loader"
            />
        </template>
    </Table>
</template>

<script setup>
import Table from '@/components/common/Table/Table.vue';
import Tr from '@/components/common/Table/Tr.vue';
import Th from '@/components/common/Table/Th.vue';
import OfferTableItem from '@/components/Offer/TableItem/OfferTableItem.vue';
import Loader from '@/components/common/Loader.vue';
import OfferTableItemSkeleton from '@/components/Offer/TableItem/OfferTableItemSkeleton.vue';
import Spinner from '@/components/common/Spinner.vue';
import ConsultantPicker from '@/components/common/Forms/ConsultantPicker/ConsultantPicker.vue';
import { useConsultantsOptions } from '@/composables/options/useConsultantsOptions.js';
import { onMounted, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DoubleInput from '@/components/common/Forms/DoubleInput.vue';
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';

defineEmits([
    'favorite-deleted',
    'deleted-from-folder',
    'show-complex-objects',
    'show-map',
    'create-task'
]);

defineProps({
    offers: Array,
    loader: Boolean,
    sortable: {
        type: Boolean,
        default: true
    },
    refreshing: Boolean
});

// query filters

const { getConsultantsOptions, isFetching: consultantsIsLoading } = useConsultantsOptions();

const consultantFilters = reactive({
    consultant_id: null
});

const priceFilters = reactive({
    rangeMinPricePerFloor: null,
    rangeMaxPricePerFloor: null
});

function initFilters() {
    consultantFilters.consultant_id = route.query.consultant_id;
}

onMounted(initFilters);

const router = useRouter();
const route = useRoute();

function confirmConsultantFilters() {
    const query = { ...route.query };

    query.consultant_id = consultantFilters.consultant_id;

    router.replace({ query });
}

watch(
    () => route.query.consultant_id,
    value => {
        consultantFilters.consultant_id = value;
    }
);

function confirmPriceFilters() {
    const query = { ...route.query };

    query.rangeMinPricePerFloor = priceFilters.rangeMinPricePerFloor;
    query.rangeMaxPricePerFloor = priceFilters.rangeMaxPricePerFloor;

    router.replace({ query });
}

watch(
    () => route.query.rangeMinPricePerFloor,
    value => {
        priceFilters.rangeMinPricePerFloor = value;
    }
);

watch(
    () => route.query.rangeMaxPricePerFloor,
    value => {
        priceFilters.rangeMaxPricePerFloor = value;
    }
);
</script>

<template>
    <Table
        :refreshing
        shadow
        fluid
        resizable
        :default-widths
        :constraints
        class="offer-table"
        storage-key="offers"
    >
        <template #thead>
            <Tr>
                <Th name="id">#</Th>
                <Th name="preview">Объект</Th>
                <Th name="region">регион</Th>
                <Th :sort="sortable ? 'from_mkad' : null" name="from-mkad">мкад</Th>
                <Th :sort="sortable ? 'area' : null" name="area">площадь</Th>
                <Th
                    v-model:filters="priceFilters"
                    @confirm-filter="confirmPriceFilters"
                    :sort="sortable ? 'price' : null"
                    name="price"
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
                <Th name="company">cобственник</Th>
                <Th
                    v-model:filters="consultantFilters"
                    @confirm-filter="confirmConsultantFilters"
                    name="consultant"
                >
                    <template #default>консультант</template>
                    <template #filter>
                        <div class="row">
                            <Spinner v-if="consultantsIsLoading" small center />
                            <ConsultantPicker
                                v-else
                                v-model="consultantFilters.agent_id"
                                :options="getConsultantsOptions"
                                class="col-12"
                                :append-to-body="false"
                            />
                        </div>
                    </template>
                </Th>
                <Th name="advertisement">реклама</Th>
                <Th :sorting-options name="date">обновление</Th>
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
                @create-folder="$emit('create-folder')"
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
    'create-folder',
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

const constraints = {
    id: {
        min: 40,
        max: 160
    },
    preview: {
        min: 180
    },
    region: {
        min: 200
    },
    date: {
        min: 120
    }
};

const defaultWidths = {
    preview: 270,
    region: 280,
    from_mkad: 80,
    area: 250,
    price: 250,
    consultant: 80,
    company: 300,
    advertisement: 200,
    date: 140
};

// query filters

const { getConsultantsOptions, isFetching: consultantsIsLoading } = useConsultantsOptions();

const consultantFilters = reactive({
    agent_id: null
});

const priceFilters = reactive({
    rangeMinPricePerFloor: null,
    rangeMaxPricePerFloor: null
});

function initFilters() {
    consultantFilters.agent_id = route.query.agent_id;
}

onMounted(initFilters);

const router = useRouter();
const route = useRoute();

function confirmConsultantFilters() {
    const query = { ...route.query };

    query.agent_id = consultantFilters.agent_id;

    router.replace({ query });
}

watch(
    () => route.query.agent_id,
    value => {
        consultantFilters.agent_id = value;
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

// sort

const sortingOptions = [
    { value: 'last_update', label: 'По дате модерации', icon: 'fa-solid fa-pen' },
    {
        value: 'last_survey_created_at',
        label: 'По дате последнего опроса',
        icon: 'fa-solid fa-square-poll-horizontal'
    }
];
</script>

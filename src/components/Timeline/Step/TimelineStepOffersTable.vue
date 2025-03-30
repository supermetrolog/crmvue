<template>
    <div>
        <div class="d-flex align-items-end justify-content-between mb-2">
            <PaginationClassic
                @next="$emit('next-page', $event)"
                :loading="!pagination && loading"
                :pagination="pagination"
            />
            <div class="d-flex align-items-end gap-2">
                <UiButton
                    @click="$emit('to-map')"
                    icon="fa-solid fa-map-location-dot"
                    :loading
                    color="light"
                >
                    Показать на карте ({{ pagination?.totalCount ?? 0 }})
                </UiButton>
                <UiButton
                    @click="$emit('refresh')"
                    icon="fa-solid fa-refresh"
                    :loading
                    color="light"
                >
                    Обновить
                </UiButton>
            </div>
        </div>
        <Table v-if="objects.length" fluid class="offer-table w-100">
            <template #thead>
                <Tr>
                    <Th>#</Th>
                    <Th>Объект</Th>
                    <Th>регион</Th>
                    <Th>мкад</Th>
                    <Th>площадь</Th>
                    <Th>цена</Th>
                    <Th>cобственник</Th>
                    <Th>консультант</Th>
                    <Th>обновление</Th>
                </Tr>
            </template>
            <template #tbody>
                <Loader v-if="loading" />
                <TimelineStepOffersTableItem
                    v-for="offer in objects"
                    :key="offer.id"
                    @favorite-deleted="$emit('favorite-deleted', $event)"
                    @select="$emit('select', offer)"
                    @unselect="$emit('unselect', offer)"
                    :offer="offer"
                    :loader="loading"
                    :selected="selectedObjectsSet.has(offer.id)"
                    :last-sent="
                        currentObjectsHash[
                            `${offer.object_id}-${offer.original_id}-${offer.type_id}`
                        ]?.created_at
                    "
                    :count="
                        currentObjectsHash[
                            `${offer.object_id}-${offer.original_id}-${offer.type_id}`
                        ]?.count
                    "
                />
            </template>
        </Table>
        <template v-else>
            <Spinner v-if="loading" label="Поиск предложений.." />
            <EmptyData v-else class="mb-2">Список предложений пуст</EmptyData>
        </template>
        <PaginationClassic
            v-if="pagination"
            @next="$emit('next-page', $event)"
            class="my-2"
            :loading="!pagination && loading"
            :pagination="pagination"
        />
    </div>
</template>

<script setup>
import PaginationClassic from '@/components/common/Pagination/PaginationClassic.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import Spinner from '@/components/common/Spinner.vue';
import Table from '@/components/common/table/Table.vue';
import Th from '@/components/common/table/Th.vue';
import Tr from '@/components/common/table/Tr.vue';
import Loader from '@/components/common/Loader.vue';
import TimelineStepOffersTableItem from '@/components/Timeline/Step/TimelineStepOffersTableItem.vue';
import { computed } from 'vue';

defineEmits(['to-map', 'next-page', 'refresh', 'favorite-deleted']);
const props = defineProps({
    pagination: Object,
    objects: {
        type: Array,
        default: () => []
    },
    loading: Boolean,
    selectedObjects: {
        type: Array,
        default: () => []
    },
    currentObjects: {
        type: Array,
        default: () => []
    },
    submittedView: Boolean
});

const selectedObjectsSet = computed(() => {
    return new Set(props.selectedObjects.map(object => object.id));
});

const currentObjectsHash = computed(() => {
    return props.currentObjects.reduce((acc, object) => {
        acc[`${object.object_id}-${object.offer_id}-${object.type_id}`] = {
            count: object.duplicate_count,
            created_at: object.created_at
        };

        return acc;
    }, {});
});
</script>

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
                    v-for="offer in preparedObjects"
                    :key="offer.object.id"
                    @favorite-deleted="$emit('favorite-deleted', $event)"
                    @select="$emit('select', offer.object)"
                    @unselect="$emit('unselect', offer.object)"
                    @show-submitted="showSubmitted(offer)"
                    :offer="offer.object"
                    :loader="loading"
                    :selected="offer.selected"
                    :last-sent="offer.lastSent"
                    :count="offer.count"
                    :submitted="offer.submitted"
                    :visited="offer.visited"
                    :visited-data="offer.visitedData"
                    :submitted-data="offer.submittedData"
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
        <teleport to="body">
            <UiModal
                v-model:visible="submittedModalIsVisible"
                @close="closeSubmittedModal"
                custom-close
                :title="`Просмотр отправлений объекта #${viewedSubmittedOffer?.object?.visual_id}`"
                :width="550"
            >
                <p class="mb-1 text-grey font-weight-semi">Предложения:</p>
                <div v-for="(offer, key) in viewedSubmittedOffer.submittedData" :key="key">
                    <UiField color="light">
                        <i class="fa-regular fa-clock" />
                        <span>{{ offer.last_sent }}</span>
                        <span>{{ offer.consultant }}</span>
                        <span>предлагал этот объект клиенту.</span>
                    </UiField>
                </div>
                <template v-if="viewedSubmittedOffer.visitedData?.length">
                    <p class="mb-1 mt-2 text-grey font-weight-semi">Показы:</p>
                    <div v-for="(offer, key) in viewedSubmittedOffer.visitedData" :key="key">
                        <UiField color="light">
                            <i class="fa-regular fa-clock" />
                            <span>{{ offer.last_sent }}</span>
                            <span>{{ offer.consultant }}</span>
                            <span>показывал этот объект клиенту.</span>
                        </UiField>
                    </div>
                </template>
                <p v-else class="mt-2 text-grey font-weight-semi">Показов не было.</p>
                <template #actions="{ close }">
                    <UiButton @click="close" icon="fa-solid fa-close" color="light" small>
                        Закрыть
                    </UiButton>
                </template>
            </UiModal>
        </teleport>
    </div>
</template>

<script setup>
import PaginationClassic from '@/components/common/Pagination/PaginationClassic.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import Spinner from '@/components/common/Spinner.vue';
import Table from '@/components/common/Table/Table.vue';
import Th from '@/components/common/Table/Th.vue';
import Tr from '@/components/common/Table/Tr.vue';
import Loader from '@/components/common/Loader.vue';
import TimelineStepOffersTableItem from '@/components/Timeline/Step/TimelineStepOffersTableItem.vue';
import { computed, ref, shallowRef } from 'vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiField from '@/components/common/UI/UiField.vue';

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
    submittedView: Boolean,
    alreadySubmittedSet: Set,
    alreadyVisitedSet: Set,
    alreadySubmitted: Object,
    alreadyVisited: Object
});

const selectedObjectsSet = computed(() => {
    return new Set(props.selectedObjects.map(object => object.id));
});

const preparedObjects = computed(() => {
    return props.objects.map(object => {
        const objectId = `${object.object_id}-${object.original_id}-${object.type_id}`;
        const shortObjectId = `${object.object_id}-${object.original_id}`;

        const submitted = props.alreadySubmittedSet.has(shortObjectId);
        const visited = props.alreadyVisitedSet.has(shortObjectId);

        return {
            objectId,
            shortObjectId,
            object,
            selected: selectedObjectsSet.value.has(object.id),
            lastSent: currentObjectsHash.value[objectId]?.created_at,
            count: currentObjectsHash.value[objectId]?.count,
            visited,
            submitted,
            visitedData: visited ? props.alreadyVisited[shortObjectId] : null,
            submittedData: submitted ? props.alreadySubmitted[shortObjectId] : null
        };
    });
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

// submitted modal

const submittedModalIsVisible = ref(false);
const viewedSubmittedOffer = shallowRef(null);

function showSubmitted(offer) {
    viewedSubmittedOffer.value = offer;
    submittedModalIsVisible.value = true;
}

function closeSubmittedModal() {
    submittedModalIsVisible.value = false;
    viewedSubmittedOffer.value = null;
}
</script>

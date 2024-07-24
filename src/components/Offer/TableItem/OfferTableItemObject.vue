<template>
    <Tr class="offer-table-item">
        <Td class="offer-table-item__id text-center" :class="{ passive: isPassive }">
            <p class="mb-1">
                {{ object.visual_id }}
            </p>
            <div class="offer-table-item__actions">
                <HoverActionsButton @click="openInChat" label="Открыть в чате">
                    <i class="fa-solid fa-comment" />
                </HoverActionsButton>
                <HoverActionsButton disabled label="Открыть PDF">
                    <i class="fa-solid fa-file-pdf" />
                </HoverActionsButton>
            </div>
        </Td>
        <Td class="offer-table-item__preview">
            <OfferTableItemObjectPreview :is-passive="isPassive" :object="object" />
        </Td>
        <Td class="offer-table-item__region text-center">
            {{ object.address }}
        </Td>
        <Td class="offer-table-item__from-mkad text-center" sort="from_mkad">
            <p v-if="object.from_mkad">{{ object.from_mkad }} <small>км</small></p>
            <p v-else>—</p>
        </Td>
        <Td class="offer-table-item__area" sort="area">
            <div class="d-flex justify-content-center">
                <OfferTableItemObjectArea :object="object" />
            </div>
        </Td>
        <Td class="offer-table-item__price" sort="price">
            <p>—</p>
        </Td>
        <Td class="offer-table-item__company">
            <p>—</p>
        </Td>
        <Td class="offer-table-item__consultant">
            <p>—</p>
        </Td>
        <Td class="offer-table-item__advertisement">
            <p>—</p>
        </Td>
        <Td class="offer-table-item__date" sort="last_update">
            <div class="d-flex justify-content-center">
                <div>
                    <DashboardChip v-if="object.status === 1" class="dashboard-bg-success-l">
                        Актив
                    </DashboardChip>
                    <DashboardChip v-else class="dashboard-bg-danger text-white">
                        Пассив
                    </DashboardChip>
                    <TableDateBlock class="mt-1" :date="updatedAt" label="Обновление" />
                </div>
            </div>
        </Td>
    </Tr>
</template>

<script setup>
import Td from '@/components/common/Table/Td.vue';
import Tr from '@/components/common/Table/Tr.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import TableDateBlock from '@/components/common/Table/TableDateBlock.vue';
import { computed, inject } from 'vue';
import OfferTableItemObjectPreview from '@/components/Offer/TableItem/OfferTableItemObjectPreview.vue';
import OfferTableItemObjectArea from '@/components/Offer/TableItem/OfferTableItemObjectArea.vue';

const $openMessengerChat = inject('$openMessengerChat');
const props = defineProps({
    object: {
        type: Object,
        required: true
    }
});

const isPassive = computed(() => props.object.status !== 1);

console.log(props.object);

const updatedAt = computed(() => {
    return props.object.last_update * 1000;
});

const openInChat = () => {
    $openMessengerChat({
        companyID: props.object.company_id,
        objectID: props.object.id
    });
};
</script>

<template>
    <div>
        <DashboardChip class="mb-1 dashboard-bg-light"> {{ label }}: </DashboardChip>
        <div class="d-flex gap-2 flex-wrap">
            <div
                v-for="offer in offers"
                :key="offer.id"
                class="w-25 dashboard-bg-light br-1 p-1"
                :class="{ 'w-50': offer.comment?.length > 60 }"
            >
                <UiChip v-if="offer.visual_id" :class="itemClass">
                    {{ offer.visual_id }}
                </UiChip>
                <UiChip v-else-if="offer.id" :class="itemClass"> ID-{{ offer.id }} </UiChip>
                <div v-if="offer.comment" class="mt-1">
                    <p class="text-grey font-weight-bold">Комментарий:</p>
                    <p>{{ offer.comment }}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import UiChip from '@/components/common/UI/UiChip.vue';

defineProps({
    label: {
        type: String,
        required: true
    },
    offers: {
        type: Array,
        required: true
    },
    itemClass: String
});
</script>

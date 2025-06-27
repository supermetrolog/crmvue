<template>
    <Tr class="survey-table-item">
        <Td :width="60" class="survey-table-item__id py-2">
            <p class="text-center">{{ tour.id }}</p>
        </Td>
        <Td :width="200" class="py-2">
            <p>{{ tour.tour_id }}</p>
        </Td>
        <Td :width="100" class="py-2">
            <p class="fs-4">{{ tour.steps_viewed }}</p>
        </Td>
        <Td :width="100">
            <p class="fs-4">{{ tour.steps_total }}</p>
        </Td>
        <Td sort="user_id" :width="180">
            <div class="d-flex align-items-center gap-2">
                <Avatar :src="tour.user.userProfile.avatar" :size="30" />
                <span>{{ tour.user.userProfile.medium_name }}</span>
            </div>
        </Td>
        <Td :width="80" class="text-center position-relative">
            <TableDateBlock :date="tour.created_at" label="Дата прохождения" />
        </Td>
    </Tr>
</template>

<script setup>
import Tr from '@/components/common/Table/Tr.vue';
import Td from '@/components/common/Table/Td.vue';
import Avatar from '@/components/common/Avatar.vue';
import TableDateBlock from '@/components/common/Table/TableDateBlock.vue';

defineEmits(['reset']);
const props = defineProps({
    tour: {
        type: Object,
        required: true
    }
});
</script>

<template>
    <div class="timeline-page-header-actions">
        <HoverActionsButton @click="$emit('edit')" :disabled label="Редактировать запрос">
            <i class="fa-solid fa-pen"></i>
        </HoverActionsButton>
        <HoverActionsButton @click="$emit('disable')" :disabled label="Отправить в пассив">
            <i class="fa-solid fa-ban" />
        </HoverActionsButton>
        <HoverActionsButton @click="$emit('complete')" :disabled label="Оформить сделку">
            <i class="fa-solid fa-check"></i>
        </HoverActionsButton>
        <HoverActionsButton disabled label="Уведомления">
            <i class="fa-solid fa-bell" />
        </HoverActionsButton>
        <Button
            v-for="consultant in consultants"
            :key="consultant.id"
            @click="changeTimeline(consultant.id)"
            class="timeline-page-header__consultant"
            info
            :class="{ active: isViewedUser(consultant.id) }"
        >
            {{ consultant.userProfile.short_name }}
        </Button>
        <TimelineHeaderStatus :request />
    </div>
</template>

<script setup>
import Button from '@/components/common/Button.vue';
import { useRoute, useRouter } from 'vue-router';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import TimelineHeaderStatus from '@/components/Timeline/TimelineHeaderStatus.vue';

defineEmits(['complete', 'disable', 'edit']);
defineProps({
    disabled: Boolean,
    request: {
        type: Object,
        required: true
    },
    consultants: {
        type: Array,
        default: () => []
    }
});

const route = useRoute();
const router = useRouter();

function isViewedUser(userID) {
    return Number(route.query.consultant_id) === Number(userID);
}

async function changeTimeline(consultantId) {
    let query = {
        ...route.query
    };

    query.consultant_id = consultantId;
    query.step = 0;

    await router.push({ query: query });
}
</script>

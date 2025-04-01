<template>
    <div class="timeline-page-header-actions">
        <UiButtonIcon
            @click="$emit('edit')"
            :disabled
            icon="fa-solid fa-pen"
            color="light"
            label="Редактировать запрос"
        />
        <UiButtonIcon
            @click="$emit('disable')"
            :disabled
            label="Отправить в пассив"
            icon="fa-solid fa-ban"
            color="light"
        />
        <UiButtonIcon
            @click="$emit('complete')"
            :disabled
            label="Оформить сделку"
            icon="fa-solid fa-check"
            color="light"
        />
        <UiButton
            v-for="consultant in consultants"
            :key="consultant.id"
            @click="changeTimeline(consultant.id)"
            class="timeline-page-header__consultant"
            :class="{ active: isViewedUser(consultant.id) }"
            color="light"
            :icon="isViewedUser(consultant.id) ? 'fa-solid fa-user-check' : 'fa-solid fa-user'"
        >
            {{ consultant.userProfile.short_name }}
        </UiButton>
        <TimelineHeaderStatus :request />
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import TimelineHeaderStatus from '@/components/Timeline/TimelineHeaderStatus.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';

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

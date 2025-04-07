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
        <span class="timeline-page-header__dot">·</span>
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
        <template v-if="canBeCreated">
            <span class="timeline-page-header__dot">·</span>
            <UiButton
                @click="createTimeline"
                class="timeline-page-header__consultant"
                color="light"
                icon="fa-solid fa-plus"
                :loading="isCreating"
            >
                Создать мой таймлайн
            </UiButton>
        </template>
        <span class="timeline-page-header__dot">·</span>
        <TimelineHeaderStatus :request />
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import TimelineHeaderStatus from '@/components/Timeline/TimelineHeaderStatus.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import { computed, ref } from 'vue';
import { useAuth } from '@/composables/useAuth.js';
import { useConfirm } from '@/composables/useConfirm.js';
import { useStore } from 'vuex';

defineEmits(['complete', 'disable', 'edit']);
const props = defineProps({
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

const { currentUserId } = useAuth();

const canBeCreated = computed(() => {
    return (
        !props.consultants.some(consultant => consultant.id === currentUserId.value) &&
        props.request.consultant_id === currentUserId.value
    );
});

const isCreating = ref(false);

const { confirm } = useConfirm();
const store = useStore();

async function createTimeline() {
    const confirmed = await confirm(
        'Новый таймлайн',
        'Вы уверены, что хотите создать новый таймлайн?'
    );
    if (!confirmed) return;

    try {
        isCreating.value = true;

        await store.dispatch('createTimeline', {
            request_id: props.request.id,
            consultant_id: currentUserId.value
        });
    } finally {
        isCreating.value = false;
    }
}
</script>

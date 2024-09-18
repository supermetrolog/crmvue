<template>
    <div class="requests-grid row">
        <template v-if="loader">
            <DashboardCardRequestSkeleton
                v-for="i in 12"
                :key="i"
                class="col-12 col-md-6 col-lg-4 col-xxl-3"
            />
        </template>
        <template v-else-if="requests.length">
            <DashboardCardRequest
                v-for="request in requests"
                :key="request.id"
                @edit="$emit('edit', request)"
                @toggle-disable="$emit('toggle-disable', request)"
                @view="$emit('view', request)"
                @to-chat="$emit('to-chat', request)"
                :request="request"
                :editable="userCanEdit(request)"
                class="col-12 col-md-6 col-lg-4 col-xxl-3"
            />
        </template>
    </div>
</template>
<script setup>
import DashboardCardRequest from '@/components/Dashboard/Card/Request/DashboardCardRequest.vue';
import DashboardCardRequestSkeleton from '@/components/Dashboard/Card/Request/DashboardCardRequestSkeleton.vue';
import { useStore } from 'vuex';

defineEmits(['edit', 'toggle-disable', 'view', 'to-chat']);
defineProps({
    loader: {
        type: Boolean,
        default: false
    },
    requests: {
        type: Array,
        default: () => []
    }
});

const store = useStore();
const userCanEdit = request => {
    return (
        Number(request.consultant_id) === Number(store.getters.THIS_USER.id) ||
        store.getters.isModerator
    );
};
</script>

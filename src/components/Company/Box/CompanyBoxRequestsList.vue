<template>
    <div class="company-item-requests">
        <CompanyBoxRequestsListItem
            v-for="request of requests"
            :key="request.id"
            @update="$emit('update', request)"
            @clone="$emit('clone', request)"
            @disable="$emit('disable', request)"
            @change-consultant="$emit('change-consultant', request)"
            :request="request"
        />
    </div>
</template>

<script setup>
import CompanyBoxRequestsListItem from '@/components/Company/Box/CompanyBoxRequestsListItem.vue';

defineEmits(['update', 'clone', 'disable', 'change-consultant']);
defineProps({
    requests: {
        type: Array,
        default: () => []
    }
});
</script>

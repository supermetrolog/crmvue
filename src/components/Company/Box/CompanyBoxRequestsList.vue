<template>
    <div class="company-item-requests">
        <CompanyBoxRequestsListItem
            v-for="request of requests"
            :key="request.id"
            @clickUpdateRequest="clickUpdateRequest(request)"
            @clickCloneRequest="clickCloneRequest(request)"
            @clickDisableRequest="clickDisableRequest(request)"
            :request="request"
        />
    </div>
</template>

<script>
import CompanyBoxRequestsListItem from '@/components/Company/Box/CompanyBoxRequestsListItem.vue';

export default {
    name: 'CompanyBoxRequestsList',
    components: { CompanyBoxRequestsListItem },
    props: {
        requests: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        clickUpdateRequest(request) {
            this.$emit('clickUpdateRequest', request);
        },
        clickCloneRequest(request) {
            this.$emit('clickCloneRequest', request);
        },
        clickDisableRequest(request) {
            this.$emit('clickDisableRequest', request);
        }
    }
};
</script>
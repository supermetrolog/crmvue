<template>
    <div class="company-item-requests">
        <CompanyBoxRequestsListItem
            v-for="request of requests"
            :key="request.id"
            @update="update(request)"
            @clone="clone(request)"
            @disable="disable(request)"
            :request="request"
        />
    </div>
</template>

<script>
import CompanyBoxRequestsListItem from '@/components/Company/Box/CompanyBoxRequestsListItem.vue';

export default {
    name: 'CompanyBoxRequestsList',
    components: { CompanyBoxRequestsListItem },
    emits: ['update', 'clone', 'disable'],
    props: {
        requests: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        clone(request) {
            this.$emit('clone', request);
        },
        update(request) {
            this.$emit('update', request);
        },
        disable(request) {
            this.$emit('disable', request);
        }
    }
};
</script>

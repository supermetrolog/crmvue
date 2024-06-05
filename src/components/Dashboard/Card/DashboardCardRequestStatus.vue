<template>
    <DashboardChip :class="statusClass">
        <div class="d-flex align-items-center">
            <p>{{ status }}</p>
            <i
                v-if="request.status == 0"
                v-tippy="statusTippy"
                class="fa-regular fa-question-circle ml-2 icon"
            />
        </div>
    </DashboardChip>
</template>

<script>
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { PassiveWhyRequest } from '@/const/const.js';

export default {
    name: 'DashboardCardRequestStatus',
    components: {
        DashboardChip
    },
    props: {
        request: {
            type: Object,
            required: true
        }
    },
    computed: {
        status() {
            if (this.request.status === 0) return 'Пассив';
            else if (this.request.status === 1) return 'Актив';
            return 'Завершен';
        },
        statusClass() {
            if (this.request.status === 0) return 'dashboard-bg-danger-l';
            else if (this.request.status === 1) return 'dashboard-bg-success-l';
            return 'dashboard-bg-success dashboard-cl-white';
        },
        statusTippy() {
            let text = PassiveWhyRequest[this.request.passive_why].label;
            if (this.request.passive_why_comment) text += ': ' + this.request.passive_why_comment;
            return text;
        }
    }
};
</script>

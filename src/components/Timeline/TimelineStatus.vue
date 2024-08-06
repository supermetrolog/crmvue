<template>
    <DashboardChip :class="statusClass">
        <div v-if="!disabled" class="d-flex align-items-center">
            <p>{{ status }}</p>
            <i
                v-if="isPassive"
                v-tippy="statusTippy"
                class="fa-regular fa-question-circle ml-2 icon"
            />
        </div>
        <span v-else>Неактивен</span>
    </DashboardChip>
</template>

<script>
import { PassiveWhyRequest } from '@/const/const';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { entityOptions } from '@/const/options/options.js';

export default {
    name: 'TimelineStatus',
    components: { DashboardChip },
    props: {
        request: {
            type: Object,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        isPassive() {
            return this.request.status === 0;
        },
        status() {
            return entityOptions.request.status[this.request.status];
        },
        statusClass() {
            if (this.disabled) return 'dashboard-bg-gray-l';

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

<template>
    <tr class="TableRequestRow">
        <td></td>
        <td colspan="5">
            <CompanyTableTimeline
                v-for="timeline in timelines"
                :key="timeline.id"
                @click="clickTimeline"
                class="CompanyTableItem-block-timeline"
                :current-steps="timeline.timelineSteps"
                :request-name="requestName"
            />
        </td>
        <td class="text-warning CompanyTableItem-notif">
            <div class="d-flex justify-content-center align-items-center">
                {{ attention ? 'Уделите внимание запросу!' : '' }}
            </div>
        </td>
        <td class="date text-center">
            <div>{{ formattedDate }}</div>
        </td>
    </tr>
</template>

<script>
import CompanyTableTimeline from '@/components/Company/Table/CompanyTableTimeline.vue';
import dayjs from 'dayjs';

export default {
    name: 'CompanyTableRequestRow',
    components: { CompanyTableTimeline },
    props: {
        timelines: {
            type: Array,
            required: true
        },
        requestName: {
            type: String,
            required: true
        },
        date: {
            type: String,
            default: new Date()
        },
        attention: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        formattedDate() {
            return dayjs(this.date).format('DD.MM.YYYY');
        }
    },
    methods: {
        clickTimeline() {
            this.$emit('clickTimeline');
        }
    }
};
</script>

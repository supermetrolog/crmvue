<template>
    <Tippy>
        <template #default>
            <DashboardChip
                class="timeline-page-header-status"
                :class="{ passive: isPassive, completed: isCompleted }"
                with-icon
            >
                <span>{{ status }}</span>
                <i v-if="isPassive" class="fa-regular fa-question-circle" />
            </DashboardChip>
        </template>
        <template v-if="isPassive" #content>
            <p>
                <span class="color-light mr-1">Причина:</span>
                <span>{{ passiveReason }}</span>
            </p>
            <hr v-if="request.passive_why_comment" />
            <p class="color-light">{{ request.passive_why_comment }}</p>
        </template>
    </Tippy>
</template>

<script setup>
import { PassiveWhyRequest } from '@/const/const';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { entityOptions } from '@/const/options/options.js';
import { computed } from 'vue';
import { requestOptions } from '@/const/options/request.options.js';
import { Tippy } from 'vue-tippy';

const props = defineProps({
    request: {
        type: Object,
        required: true
    }
});

const isPassive = computed(() => {
    return props.request.status === requestOptions.statusStatement.PASSIVE;
});

const isCompleted = computed(() => {
    return props.request.status === requestOptions.statusStatement.COMPLETED;
});

const status = computed(() => {
    return entityOptions.request.status[props.request.status];
});

const passiveReason = computed(() => PassiveWhyRequest[props.request.passive_why].label);
</script>

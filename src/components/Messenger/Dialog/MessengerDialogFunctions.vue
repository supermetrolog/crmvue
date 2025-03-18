<template>
    <div class="messenger-dialog-functions">
        <div
            v-if="counts.tasks > 0"
            v-tippy="tasksButtonTitle"
            class="messenger-dialog-functions__item bg-black rounded-icon"
        >
            <span class="messenger-dialog-functions__chip rounded-icon">{{ counts.tasks }}</span>
            <i class="fa-solid fa-bolt"></i>
        </div>
        <div
            v-if="counts.notifications > 0"
            v-tippy="alertsButtonTitle"
            class="messenger-dialog-functions__item bg-orange rounded-icon"
        >
            <span class="messenger-dialog-functions__chip rounded-icon">
                {{ counts.notifications }}
            </span>
            <i class="fa-solid fa-exclamation"></i>
        </div>
        <div
            v-if="counts.messages > 0"
            v-tippy="messagesButtonTitle"
            class="messenger-dialog-functions__item messenger-dialog-functions__messages rounded-icon"
        >
            {{ counts.messages }}
        </div>
    </div>
</template>
<script setup>
import { plural } from '@/utils/plural.js';
import { messenger } from '@/const/messenger.js';
import { computed } from 'vue';

const props = defineProps({
    counts: {
        type: Object,
        required: true
    }
});

const tasksButtonTitle = computed(() => {
    if (props.counts.tasks) return plural(props.counts.tasks, ...messenger.buttons.tasks.plural);
    return messenger.buttons.tasks.empty;
});

const messagesButtonTitle = computed(() => {
    if (props.counts.messages)
        return plural(props.counts.messages, ...messenger.buttons.messages.plural);
    return messenger.buttons.messages.empty;
});
const alertsButtonTitle = computed(() => {
    if (props.counts.notifications)
        return plural(props.counts.notifications, ...messenger.buttons.alerts.plural);
    return messenger.buttons.alerts.empty;
});
</script>

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
            v-if="counts.reminders > 0"
            v-tippy="remindersButtonTitle"
            class="messenger-dialog-functions__item bg-red rounded-icon"
        >
            <span class="messenger-dialog-functions__chip rounded-icon">
                {{ counts.reminders }}
            </span>
            <i class="fa-solid fa-bell"></i>
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
            class="messenger-dialog-functions__item rounded-icon"
        >
            <span class="messenger-dialog-functions__chip rounded-icon">{{ counts.messages }}</span>
            <i class="fa-solid fa-envelope"></i>
        </div>
    </div>
</template>
<script setup>
import plural from 'plural-ru';
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
const remindersButtonTitle = computed(() => {
    if (props.counts.reminders)
        return plural(props.counts.reminders, ...messenger.buttons.reminders.plural);
    return messenger.buttons.reminders.empty;
});
</script>

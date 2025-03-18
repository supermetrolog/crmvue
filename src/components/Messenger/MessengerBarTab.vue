<template>
    <div @click="$emit('select')" class="messenger-bar-tab" :class="{ visible: isVisible }">
        <div class="messenger-bar-tab__list">
            <div v-tippy="label" class="messenger-bar-tab__label mb-1">
                {{ label }}
            </div>
            <Spinner v-if="loading" class="mini" />
            <Tippy v-if="counts.outdated_call_count_all > 0">
                <template #default>
                    <MessengerBarElement
                        @click.stop="$emit('select', messenger.tabFilters.CALL)"
                        class="messenger-bar-tab__phone"
                        :class="{
                            disabled: !counts.outdated_call_count,
                            active: current === messenger.tabFilters.CALL
                        }"
                        icon="fa-solid fa-phone"
                        :label="counts.outdated_call_count"
                    />
                </template>
                <template #content>
                    <p>{{ callsButtonTitle }}</p>
                    <p class="color-light">{{ callsButtonTitleAll }}</p>
                </template>
            </Tippy>
            <MessengerBarElement
                v-if="counts.unread_task_count"
                v-tippy="tasksButtonTitle"
                @click.stop="$emit('select', messenger.tabFilters.TASK)"
                class="bg-black"
                :class="{
                    disabled: !counts.unread_task_count,
                    active: current === messenger.tabFilters.TASK
                }"
                icon="fa-solid fa-bolt"
                :label="counts.unread_task_count"
            />
            <MessengerBarElement
                v-if="counts.unread_notification_count"
                v-tippy="alertsButtonTitle"
                @click.stop="$emit('select', messenger.tabFilters.NOTIFICATION)"
                class="bg-orange"
                :class="{
                    disabled: !counts.unread_notification_count,
                    active: current === messenger.tabFilters.NOTIFICATION
                }"
                icon="fa-solid fa-exclamation"
                :label="counts.unread_notification_count"
            />
            <MessengerBarElement
                v-if="counts.unread_message_count"
                v-tippy="messagesButtonTitle"
                @click.stop="$emit('select', messenger.tabFilters.MESSAGE)"
                :class="{
                    disabled: !counts.unread_message_count,
                    active: current === messenger.tabFilters.MESSAGE
                }"
                icon="fa-solid fa-envelope"
                :label="counts.unread_message_count"
            />
        </div>
    </div>
</template>
<script setup>
import MessengerBarElement from '@/components/Messenger/MessengerBarElement.vue';
import { plural } from '@/utils/plural.js';
import { messenger } from '@/const/messenger';
import { computed } from 'vue';
import Spinner from '@/components/common/Spinner.vue';
import { Tippy } from 'vue-tippy';

defineEmits(['select']);
const props = defineProps({
    counts: {
        type: Object,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    current: {
        type: String,
        default: null
    },
    icon: {
        type: String,
        default: null
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const tasksButtonTitle = computed(() => {
    if (props.counts.unread_task_count > 0)
        return plural(props.counts.unread_task_count, ...messenger.buttons.tasks.plural);
    return messenger.buttons.tasks.empty;
});

const messagesButtonTitle = computed(() => {
    if (props.counts.unread_message_count > 0)
        return plural(props.counts.unread_message_count, ...messenger.buttons.messages.plural);
    return messenger.buttons.messages.empty;
});

const alertsButtonTitle = computed(() => {
    if (props.counts.unread_notification_count > 0)
        return plural(props.counts.unread_notification_count, ...messenger.buttons.alerts.plural);
    return messenger.buttons.alerts.empty;
});

const callsButtonTitle = computed(() => {
    if (props.counts.outdated_call_count > 0)
        return plural(props.counts.outdated_call_count, ...messenger.buttons.calls.plural);
    return messenger.buttons.calls.empty;
});

const callsButtonTitleAll = computed(() => {
    if (props.counts.outdated_call_count_all > 0)
        return plural(props.counts.outdated_call_count_all, ...messenger.buttons.calls_all.plural);
    return messenger.buttons.calls.empty;
});

const isVisible = computed(() => {
    return (
        props.counts.unread_message_count > 0 ||
        props.counts.unread_notification_count > 0 ||
        props.counts.unread_task_count > 0
    );
});
</script>

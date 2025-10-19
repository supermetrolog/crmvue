<template>
    <div>
        <VirtualDragList
            :model-value="notifications"
            disabled
            data-key="id"
            class="header-summary-user-notifications__list position-relative"
            item-class="header-summary-user-notifications__card"
            :keeps
        >
            <template v-if="!notifications.length && !loading" #header>
                <UiField color="light" class="header-summary-user-notifications__empty">
                    Нет уведомлений
                </UiField>
            </template>
            <template #item="{ record }">
                <div>
                    <slot name="item" :notification="record">
                        <UserNotificationInlineCard
                            @click="$emit('select', record.id)"
                            :notification="record"
                        />
                    </slot>
                </div>
            </template>
            <template #footer>
                <Loader v-if="loading" class="absolute-center" />
                <InfiniteLoading
                    v-if="notifications.length && !loading"
                    @infinite="$emit('load', $event)"
                    class="my-2"
                >
                    <template #complete>
                        <UiField color="light" class="mx-auto op-7">
                            <i class="fa-solid fa-ban" />
                            <span>Больше уведомлений нет..</span>
                        </UiField>
                    </template>
                    <template #spinner>
                        <Spinner small />
                    </template>
                </InfiniteLoading>
            </template>
        </VirtualDragList>
    </div>
</template>
<script setup lang="ts">
import VirtualDragList from 'vue-virtual-draglist';
import InfiniteLoading from 'v3-infinite-loading';
import Loader from '@/components/common/Loader.vue';
import UiField from '@/components/common/UI/UiField.vue';
import Spinner from '@/components/common/Spinner.vue';
import { ShortUserNotification } from '@/types/user-notification/user-notification';
import UserNotificationInlineCard from '@/components/UserNotificationInlineCard/UserNotificationInlineCard.vue';

export interface InfiniteLoadingState {
    complete(): void;

    loaded(): void;
}

defineEmits<{
    (e: 'close'): void;
    (e: 'load', $state: InfiniteLoadingState): void;
    (e: 'select', notificationId: number): void;
}>();

withDefaults(
    defineProps<{
        keeps?: number;
        notifications: ShortUserNotification[];
        loading?: boolean;
    }>(),
    { keeps: 15 }
);

defineSlots<{
    item(props: { notification: ShortUserNotification }): void;
}>();
</script>

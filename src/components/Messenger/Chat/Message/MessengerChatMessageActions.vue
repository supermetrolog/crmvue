<template>
    <div class="messenger-chat-message-actions">
        <HoverActions>
            <HoverActionsButton
                @click="
                    $createAddition({
                        messageID: message.id,
                        additionType: 'alert',
                        successMessage: 'Уведомление успешно создано!'
                    })
                "
                label="Добавить уведомление"
            >
                <i class="fa-solid fa-exclamation"></i>
            </HoverActionsButton>
            <HoverActionsButton
                @click="
                    $createAddition({
                        messageID: message.id,
                        additionType: 'reminder',
                        successMessage: 'Напоминание успешно создано!'
                    })
                "
                label="Добавить напоминание"
            >
                <i class="fa-solid fa-bell"></i>
            </HoverActionsButton>
            <HoverActionsButton
                @click="
                    $createAddition({
                        messageID: message.id,
                        additionType: 'task',
                        successMessage: 'Задача успешно создана!'
                    })
                "
                label="Добавить задачу"
            >
                <i class="fa-solid fa-bolt"></i>
            </HoverActionsButton>
            <HoverActionsButton
                @click="$emit('pin-to-object')"
                disabled
                :active="message.pinnedToObject"
                :label="message.pinnedToObject ? 'Открепить от объекта' : 'Закрепить за объектом'"
            >
                <i class="fa-solid fa-warehouse"></i>
            </HoverActionsButton>
            <HoverActionsButton
                @click="$emit('pin')"
                :label="pinned ? 'Открепить' : 'Закрепить'"
                :active="pinned"
            >
                <i class="fa-solid fa-thumbtack"></i>
            </HoverActionsButton>
            <HoverActionsButton v-if="canEdit" @click="$emit('edit')" label="Редактировать">
                <i class="fa-solid fa-pen"></i>
            </HoverActionsButton>
        </HoverActions>
    </div>
</template>
<script setup>
import HoverActions from '@/components/common/HoverActions/HoverActions.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import { useStore } from 'vuex';
import { computed, inject } from 'vue';

defineEmits(['pin', 'edit', 'pin-to-object']);
const props = defineProps({
    message: {
        type: Object,
        required: true
    },
    pinned: {
        type: Boolean,
        default: false
    }
});

const store = useStore();
const $createAddition = inject('$createAddition');

const canEdit = computed(() => {
    return (
        props.message.from.model_type === 'user' &&
        props.message.from.model.id === store.getters.THIS_USER.id
    );
});
</script>

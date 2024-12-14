<template>
    <div class="messenger-quiz__footer">
        <MessengerButton @click="$emit('complete')" color="success" :disabled>
            Готово
        </MessengerButton>
        <template v-if="isObjectChatMember">
            <MessengerButton @click="$emit('object-sold')" class="ml-auto">
                Объект продан
            </MessengerButton>
            <MessengerButton @click="$emit('object-destroyed')" :disabled="objectIsPassive">
                Объект снесен
            </MessengerButton>
        </template>
    </div>
</template>
<script setup>
import MessengerButton from '@/components/Messenger/MessengerButton.vue';
import { useStore } from 'vuex';
import { computed } from 'vue';
import { messenger } from '@/const/messenger.js';

defineEmits(['object-sold', 'object-destroyed', 'complete']);
defineProps({
    disabled: Boolean
});

const store = useStore();

const isObjectChatMember = computed(() => {
    return (
        store.state.Messenger.currentDialog?.model?.type ===
        messenger.objectChatMemberTypes.RENT_OR_SALE
    );
});

const objectIsPassive = computed(
    () => store.state.Messenger.currentDialog.model.object.status !== 1
);
</script>

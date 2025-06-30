<template>
    <UiDropdownActions title="Действия над контактом">
        <template #trigger>
            <Tippy interactive :interactive-border="40">
                <template #default>
                    <UiButton
                        small
                        color="white"
                        :loading
                        :icon="isPassive ? 'fa-solid fa-ban' : undefined"
                    >
                        <span>{{ contact.full_name }} (#{{ contact.id }})</span>
                        <i class="fa-solid fa-pen ml-2 text-grey" />
                    </UiButton>
                </template>
                <template #content>
                    <ContactCard :contact="contact" />
                </template>
            </Tippy>
        </template>
        <template #menu>
            <UiDropdownActionsGroup>
                <UiDropdownActionsButton
                    @handle="$emit('edit')"
                    label="Редактировать"
                    icon="fa-solid fa-pen"
                />
                <UiDropdownActionsButton
                    v-if="isPassive"
                    @handle="$emit('enable')"
                    label="Восстановить"
                    icon="fa-solid fa-undo"
                />
                <UiDropdownActionsButton
                    v-else
                    @handle="$emit('disable')"
                    label="Архивировать"
                    icon="fa-solid fa-ban"
                />
            </UiDropdownActionsGroup>
        </template>
    </UiDropdownActions>
</template>

<script setup lang="ts">
import UiButton from '@/components/common/UI/UiButton.vue';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import UiDropdownActions from '@/components/common/UI/DropdownActions/UiDropdownActions.vue';
import { computed } from 'vue';
import UiDropdownActionsGroup from '@/components/common/UI/DropdownActions/UiDropdownActionsGroup.vue';
import { contactOptions } from '@/const/options/contact.options';
import { Tippy } from 'vue-tippy';
import ContactCard from '@/components/Contact/Card/ContactCard.vue';

defineEmits<{
    (e: 'show'): void;
    (e: 'edit'): void;
    (e: 'disable'): void;
    (e: 'enable'): void;
    (e: 'change-consultant'): void;
    (e: 'clone'): void;
}>();

const props = defineProps({
    contact: {
        type: Object,
        required: true
    },
    loading: Boolean
});

const isPassive = computed(() => props.contact.status === contactOptions.statusStatement.PASSIVE);
</script>

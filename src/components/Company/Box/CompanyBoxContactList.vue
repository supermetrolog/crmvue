<template>
    <div>
        <div class="company-box-main__subtitle mb-2">
            <strong>Контакты</strong>
            <UiButton
                @click="$emit('create')"
                :disabled="loading"
                small
                color="light"
                icon="fa-solid fa-plus"
            >
                Добавить контакт
            </UiButton>
        </div>
        <div v-if="loading" class="company-box-main__contacts">
            <CompanyBoxContactListItemSkeleton v-for="key in 5" :key="key" />
        </div>
        <div
            v-show="!loading"
            ref="listElement"
            @wheel.prevent
            class="company-box-main__contacts pb-2"
        >
            <CompanyBoxContactListItem
                v-for="contact in contacts"
                :key="contact.id"
                @click="show(contact)"
                @edit="$emit('edit', contact)"
                @disable="$emit('disable', contact)"
                @enable="$emit('enable', contact)"
                @delete="$emit('delete', contact)"
                :contact="contact"
                :editable
            />
        </div>
    </div>
</template>

<script setup>
import CompanyBoxContactListItem from './CompanyBoxContactListItem.vue';
import { inject, useTemplateRef } from 'vue';
import { useHorizontalScroll } from '@/composables/useHorizontalScroll.js';
import CompanyBoxContactListItemSkeleton from '@/components/Company/Box/CompanyBoxContactListItemSkeleton.vue';
import UiButton from '@/components/common/UI/UiButton.vue';

const emit = defineEmits(['create', 'show', 'edit', 'disable', 'enable', 'delete']);
defineProps({
    contacts: {
        type: Array,
        required: true
    },
    loading: Boolean,
    editable: Boolean
});

const openContact = inject('openContact');

function show(contact) {
    if (openContact) openContact(contact);

    emit('show', contact);
}

const listElement = useTemplateRef('listElement');
useHorizontalScroll(listElement);
</script>

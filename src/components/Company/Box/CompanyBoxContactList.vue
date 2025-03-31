<template>
    <div>
        <div class="company-box-main__subtitle mb-2">
            <strong>Контакты</strong>
            <UiButtonIcon
                @click="$emit('create')"
                label="Добавить контакт"
                :disabled="loading"
                small
                color="light"
                icon="fa-solid fa-plus"
            />
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
                :contact="contact"
            />
        </div>
    </div>
</template>

<script setup>
import CompanyBoxContactListItem from './CompanyBoxContactListItem.vue';
import { inject, useTemplateRef } from 'vue';
import { useHorizontalScroll } from '@/composables/useHorizontalScroll.js';
import CompanyBoxContactListItemSkeleton from '@/components/Company/Box/CompanyBoxContactListItemSkeleton.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';

const emit = defineEmits(['create', 'show']);
defineProps({
    contacts: {
        type: Array,
        required: true
    },
    loading: Boolean
});

const openContact = inject('openContact');

function show(contact) {
    if (openContact) openContact(contact);

    emit('show', contact);
}

const listElement = useTemplateRef('listElement');
useHorizontalScroll(listElement);
</script>

<template>
    <Tippy
        interactive
        max-width="500"
        :interactive-border="30"
        :on-show="onTriggerContacts"
        :on-hide="onUntriggerContacts"
        :delay="[300, null]"
        placement="left"
    >
        <template #default>
            <TaskCardButton bordered>
                <span>Контакты</span>
                <i class="fa-solid fa-contact-card ml-2"></i>
            </TaskCardButton>
        </template>
        <template #content>
            <TaskCardContacts :visible="contactsIsVisible" :company-id="companyId" />
        </template>
    </Tippy>
</template>

<script setup>
import { ref } from 'vue';
import { Tippy } from 'vue-tippy';
import TaskCardContacts from '@/components/TaskCard/TaskCardContactsList.vue';
import TaskCardButton from '@/components/TaskCard/TaskCardButton.vue';

defineProps({
    task: {
        type: Object,
        required: true
    },
    companyId: {
        type: Number,
        required: true
    }
});

const contactsIsVisible = ref(false);

function onTriggerContacts() {
    contactsIsVisible.value = true;
}

function onUntriggerContacts() {
    contactsIsVisible.value = false;
}
</script>

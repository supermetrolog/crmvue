<template>
    <div>
        <p>Добрый день, {{ mediumName }}!</p>
    </div>
</template>
<script setup lang="ts">
import { Contact } from '@/types/contact/contact';
import { User } from '@/types/user';
import { computed } from 'vue';

const props = defineProps<{
    contact: Contact;
    user: User;
    company: any;
}>();

const mediumName = computed(() => {
    if (props.contact.middle_name && props.contact.first_name) {
        return `${props.contact.first_name} ${props.contact.middle_name}`;
    } else {
        return props.contact.full_name;
    }
});
</script>

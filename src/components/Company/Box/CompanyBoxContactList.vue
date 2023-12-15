<template>
    <strong>
        Контакты
        <small @click="this.$emit('clickCreateContact')" class="edit_btn CompanyBoxContactList-create">
            [создать]
        </small>
    </strong>
    <div class="CompanyBoxContactList">
        <CompanyBoxContactListItem v-for="contact in contacts" :key="contact.id" :contact="contact" />
    </div>
</template>

<script>
import CompanyBoxContactListItem from './CompanyBoxContactListItem.vue';

export default {
    name: 'CompanyBoxContactList',
    components: {
        CompanyBoxContactListItem
    },
    emits: ['clickCreateContact'],
    props: {
        contacts: {
            type: Array,
            required: true
        }
    }
};
</script>
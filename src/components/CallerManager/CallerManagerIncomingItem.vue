<template>
    <div class="caller-manager__item">
        <CallerManagerIncomingHeader :call="call" />
        <CallerManagerExistContact v-if="call.phoneFrom" :contact="call.phoneFrom.contact" />
        <CallerManagerNotExistContact v-else />
    </div>
</template>

<script>
import CallerManagerNotExistContact from '@/components/CallerManager/CallerManagerNotExistContact.vue';
import CallerManagerExistContact from '@/components/CallerManager/CallerManagerExistContact.vue';
import CallerManagerIncomingHeader from '@/components/CallerManager/CallerManagerIncomingHeader.vue';

export default {
    name: 'CallerManagerIncomingItem',
    components: {
        CallerManagerIncomingHeader,
        CallerManagerExistContact,
        CallerManagerNotExistContact
    },
    props: {
        call: {
            type: Object
        }
    },
    mounted() {}
};
</script>

<style></style>

<template>
    <div class="caller-manager__item">
        <CallerManagerOutcomingHeader :call="call"/>
        <CallerManagerExistContact
            v-if="call.phoneTo"
            :contact="call.phoneTo.contact"
        />
        <CallerManagerNotExistContact v-else/>
    </div>
</template>

<script>

import CallerManagerNotExistContact from "@/components/CallerManager/CallerManagerNotExistContact.vue";
import CallerManagerExistContact from "@/components/CallerManager/CallerManagerExistContact.vue";
import CallerManagerOutcomingHeader from "@/components/CallerManager/CallerManagerOutcomingHeader.vue";

export default {
    name: "CallerManagerOutcomingItem",
    components: {
        CallerManagerOutcomingHeader,
        CallerManagerExistContact,
        CallerManagerNotExistContact
    },
    props: {
        call: {
            type: Object,
        },
    }
};
</script>

<style>
</style>
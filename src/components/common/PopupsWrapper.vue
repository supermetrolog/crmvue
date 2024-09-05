<template>
    <teleport to="body">
        <PhoneNumberPopup />
        <Confirm />
        <FormModalTask />
    </teleport>
</template>
<script setup>
import PhoneNumberPopup from '@/components/common/PhoneNumberPopup.vue';
import Confirm from '@/components/common/Confirm.vue';
import FormModalTask from '@/components/Forms/FormModalTask.vue';
</script>

<template>
    <div class="header__actions">
        <teleport to="body">
            <FormCompanyDeal v-if="dealFormIsVisible" @close="dealFormIsVisible = false" />
        </teleport>
        <Button @click="dealFormIsVisible = true" small icon>
            Создать сделку
            <i class="ml-2 fa-solid fa-bolt"></i>
        </Button>
    </div>
</template>

<script setup>
import FormCompanyDeal from '@/components/Forms/Company/FormCompanyDeal.vue';
import Button from '@/components/common/Button.vue';
import { shallowRef } from 'vue';

const dealFormIsVisible = shallowRef(false);
</script>

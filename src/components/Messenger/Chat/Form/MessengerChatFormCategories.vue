<template>
    <div class="messenger-chat-form__categories">
        <RadioChip
            v-for="(category, key) in messenger.categories"
            :key="category"
            v-model="currentID"
            :value="Number(key)"
            :label="category"
            unselect
            class="messenger-chat-form__category"
        />
    </div>
</template>
<script setup>
import { messenger } from '@/const/messenger';
import RadioChip from '@/components/common/Forms/RadioChip.vue';

const currentID = defineModel();
</script>

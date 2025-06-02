<template>
    <RadioChip :rounded="false" label="Да" class="messenger-quiz-form__radio-chip">
        <slot v-if="$slots.default" />
    </RadioChip>
</template>
<script setup>
import RadioChip from '@/components/common/Forms/RadioChip.vue';
</script>

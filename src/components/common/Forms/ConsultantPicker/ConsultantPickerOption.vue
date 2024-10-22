<template>
    <div class="consultant-picker-option">
        <Avatar v-tippy="label" :src="option.avatar" :size="30" />
        <span>{{ option.label }}</span>
    </div>
</template>
<script setup>
import Avatar from '@/components/common/Avatar.vue';
import { h } from 'vue';
import ConsultantPickerOptionLabel from '@/components/common/Forms/ConsultantPicker/ConsultantPickerOptionLabel.vue';

const props = defineProps({
    option: {
        type: Object,
        required: true
    }
});

const label = { content: h(ConsultantPickerOptionLabel, { option: props.option }) };
</script>

<template>
    <div class="consultant-picker-option">
        <Avatar ref="avatar" :src="option.avatar" :size="30" />
        <span>{{ option.label }}</span>
    </div>
</template>
<script setup>
import Avatar from '@/components/common/Avatar.vue';
import { h, useTemplateRef } from 'vue';
import ConsultantPickerOptionLabel from '@/components/common/Forms/ConsultantPicker/ConsultantPickerOptionLabel.vue';
import { useTippy } from 'vue-tippy';

const props = defineProps({
    option: {
        type: Object,
        required: true
    }
});

useTippy(useTemplateRef('avatar'), {
    content: h(ConsultantPickerOptionLabel, { option: props.option })
});
</script>

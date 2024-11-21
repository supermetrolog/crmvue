<template>
    <div class="consultant-picker-option consultant-picker-option-chip">
        <Avatar
            v-tippy="label"
            class="consultant-picker-option-chip__avatar"
            :src="option.avatar"
            :size="25"
        />
        <span>{{ option.label }}</span>
        <i
            @click="$emit('remove')"
            class="fa-regular fa-circle-xmark consultant-picker-option-chip__close"
        ></i>
    </div>
</template>
<script setup>
import Avatar from '@/components/common/Avatar.vue';
import { h } from 'vue';
import ConsultantPickerOptionLabel from '@/components/common/Forms/ConsultantPicker/ConsultantPickerOptionLabel.vue';

defineEmits(['remove']);
const props = defineProps({
    option: {
        type: Object,
        required: true
    }
});

const label = { content: h(ConsultantPickerOptionLabel, { option: props.option }) };
</script>

<template>
    <div class="consultant-picker-option">
        <Avatar ref="avatar" :src="option.avatar" :size="30" />
        <span>{{ option.label }}</span>
        <span v-if="showRole && option.role" class="text-grey fs-2">{{ option.role }}</span>
    </div>
</template>
<script setup lang="ts">
import Avatar from '@/components/common/Avatar.vue';
import { h, useTemplateRef } from 'vue';
import ConsultantPickerOptionLabel from '@/components/common/Forms/ConsultantPicker/ConsultantPickerOptionLabel.vue';
import { useTippy } from 'vue-tippy';
import { ConsultantPickerOption } from '@/components/common/Forms/ConsultantPicker/ConsultantPicker.vue';

const props = defineProps<{ option: ConsultantPickerOption; showRole?: boolean }>();

useTippy(useTemplateRef('avatar'), {
    content: h(ConsultantPickerOptionLabel, { option: props.option })
});
</script>

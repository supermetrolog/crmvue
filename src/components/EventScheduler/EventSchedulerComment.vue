<template>
    <UiTextarea
        v-model="comment"
        :label
        :auto-height
        :placeholder
        :v
        :min-height
        :max-height
        :class="`col-${cols}`"
        data-tour-id="scheduler:comment"
    />
</template>
<script setup lang="ts">
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';

const comment = defineModel<string>();

const {
    label = 'Комментарий',
    cols = 12,
    placeholder = 'Комментарий к событию..',
    autoHeight = true,
    minHeight = 60,
    maxHeight = 200
} = defineProps<{
    label?: string;
    placeholder?: string;
    cols?: number;
    v?: object;
    autoHeight?: boolean;
    minHeight?: number;
    maxHeight?: number;
}>();
</script>

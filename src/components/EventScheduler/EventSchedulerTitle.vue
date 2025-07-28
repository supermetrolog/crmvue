<template>
    <UiInput
        v-if="titleInputShouldBeShown || shown"
        v-model="title"
        :v
        :label
        :class="`col-${cols}`"
        :placeholder
        required
    />
</template>
<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import UiInput from '@/components/common/Forms/UiInput.vue';
import { isNullish } from '@/utils/helpers/common/isNullish';

const title = defineModel<string>();

const { label = 'Название задачи', cols = 12 } = defineProps<{
    label?: string;
    cols?: number;
    v?: object;
    shown?: boolean;
    placeholder?: string;
}>();

const titleInputShouldBeShown = ref(false);

onBeforeMount(() => {
    titleInputShouldBeShown.value = isNullish(title.value) || title.value.length < 16;
});
</script>

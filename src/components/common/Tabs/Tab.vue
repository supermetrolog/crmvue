<template>
    <VTab v-bind="$attrs">
        <slot />
    </VTab>
</template>
<script>
import { Tab as VTab } from 'vue3-tabs-component';
export default {
    name: 'Tab',
    components: { VTab }
};
</script>

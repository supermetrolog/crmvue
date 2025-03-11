<template>
    <div class="loader" :class="{ small: small, global: global }">
        <div class="loader__container">
            <Spinner :class="{ small: small }" :label />
        </div>
    </div>
</template>

<script setup>
import Spinner from '@/components/common/Spinner.vue';

defineProps({
    small: Boolean,
    label: String,
    global: Boolean
});
</script>

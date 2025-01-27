<template>
    <div class="loader" :class="{ small: small }">
        <div class="loader__container">
            <Spinner :class="{ small: small }" :label />
        </div>
    </div>
</template>

<script setup>
import Spinner from '@/components/common/Spinner.vue';

defineProps({ small: { type: Boolean, default: false }, label: String });
</script>

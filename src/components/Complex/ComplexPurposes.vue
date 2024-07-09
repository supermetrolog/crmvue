<template>
    <div class="complex-purposes">
        <strong
            v-for="(purpose, key) of preparedPurposes"
            :key="key"
            v-tippy="purpose.name"
            class="complex-purposes__item"
        >
            <i :class="purpose.icon"></i>
        </strong>
    </div>
</template>
<script setup>
import { entityOptions } from '@/const/options/options';
import { computed } from 'vue';

const props = defineProps({
    purposes: {
        type: Array,
        required: true
    }
});

const preparedPurposes = computed(() => {
    return props.purposes.map(purpose => entityOptions.object.purposes[purpose]);
});
</script>

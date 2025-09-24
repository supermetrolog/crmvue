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
import { computed } from 'vue';
import { objectPurposesOptions } from '@/const/options/object.options.js';

const props = defineProps({
    purposes: {
        type: Array,
        required: true
    }
});

const preparedPurposes = computed(() => {
    return props.purposes
        .filter(purpose => purpose !== 0 && purpose !== '0')
        .map(purpose => objectPurposesOptions[purpose]);
});
</script>

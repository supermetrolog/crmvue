<template>
    <Tippy>
        <Button
            solid
            class="timeline-step-offers__button timeline-step-offers__button--filters"
            :active
            :class="{ active: active }"
        >
            <span class="timeline-step-offers__icon">
                <span>CRM</span>
                <span>search</span>
            </span>
            <span>{{ label }}</span>
            <Spinner v-if="loading" class="ml-2 mini" />
            <span v-else-if="isNotNullish(count)" class="ml-1">({{ count }})</span>
        </Button>
        <template #content>
            <slot />
        </template>
    </Tippy>
</template>

<script setup>
import Button from '@/components/common/Button.vue';
import { Tippy } from 'vue-tippy';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';
import Spinner from '@/components/common/Spinner.vue';

defineProps({
    count: Number,
    active: Boolean,
    loading: Boolean,
    label: String
});
</script>

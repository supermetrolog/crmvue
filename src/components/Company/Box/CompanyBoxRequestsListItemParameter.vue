<template>
    <div class="company-item-request-parameter">
        <p class="company-item-request-parameter__name">
            <span>{{ label }}</span>
            <span v-if="$slots['unit-type']" class="company-item-request-parameter__unit-type">
                <slot name="unit-type" />
            </span>
        </p>
        <slot name="extended">
            <span class="company-item-request-parameter__value">
                <slot>
                    {{ valueText }}
                </slot>
            </span>
        </slot>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { isString } from '@/utils/helpers/string/isString.js';
import { isNumber } from '@/utils/helpers/number/isNumber.js';

const props = defineProps({
    label: {
        type: String,
        required: true
    },
    value: [String, Number, Boolean],
    yesText: {
        type: String,
        default: 'Да'
    },
    noText: {
        type: String,
        default: 'Нет'
    }
});

const valueText = computed(() => {
    if (props.value === undefined) return 'Нет данных';

    if (props.value === null) return props.noText;

    if (isString(props.value)) return props.value === '1' ? props.yesText : props.noText;
    if (isNumber(props.value)) return props.value === 1 ? props.yesText : props.noText;

    return props.value ? props.yesText : props.noText;
});
</script>

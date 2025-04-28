<template>
    <li class="company-box-main__row">
        <CompanyBoxCell>
            <slot>
                <span v-if="hasValue">{{ value }}</span>
                <span v-else class="dashboard-cl-danger">Не заполнено</span>
            </slot>
        </CompanyBoxCell>
        <CompanyBoxCell>{{ label }}</CompanyBoxCell>
    </li>
</template>

<script setup>
import CompanyBoxCell from '@/components/Company/Box/CompanyBoxCell.vue';
import { computed } from 'vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { isNotEmptyString } from '@/utils/helpers/string/isNotEmptyString.js';

const props = defineProps({
    label: {
        type: String,
        required: true
    },
    value: [String, Number]
});

const hasValue = computed(() => isNotNullish(props.value) && isNotEmptyString(props.value));
</script>

<template>
    <li class="company-box-main__row">
        <CompanyBoxCell>
            <slot>
                <span class="dashboard-cl-danger">Не заполнено</span>
            </slot>
        </CompanyBoxCell>
        <CompanyBoxCell>{{ label }}</CompanyBoxCell>
    </li>
</template>

<script setup>
import CompanyBoxCell from '@/components/Company/Box/CompanyBoxCell.vue';

defineProps({
    label: {
        type: String,
        required: true
    }
});
</script>

<template>
    <li class="company-box-main__row">
        <CompanyBoxCell>
            <slot>
                <span>Нет данных</span>
            </slot>
        </CompanyBoxCell>
        <CompanyBoxCell>{{ label }}</CompanyBoxCell>
    </li>
</template>

<script>
import CompanyBoxCell from '@/components/Company/Box/CompanyBoxCell.vue';

export default {
    name: 'CompanyBoxRow',
    components: { CompanyBoxCell },
    props: {
        label: {
            type: String,
            required: true
        }
    }
};
</script>

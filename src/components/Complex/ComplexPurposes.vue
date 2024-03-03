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
<script>
import { entityOptions } from '@/const/options/options';

export default {
    name: 'ComplexPurposes',
    props: {
        purposes: {
            type: Array,
            required: true
        }
    },
    computed: {
        preparedPurposes() {
            return this.purposes.map(purpose => entityOptions.object.purposes[purpose]);
        }
    }
};
</script>

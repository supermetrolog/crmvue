<template>
    <div class="ObjectHoldingsOwnerList">
        <ComplexHoldingOwnerItem :company="company" />
    </div>
</template>

<script>
import ComplexHoldingOwnerItem from '@/components/Complex/Holding/ComplexHoldingOwnerItem.vue';

export default {
    name: 'ComplexHoldingOwnerList',
    components: { ComplexHoldingOwnerItem },
    props: {
        company: {
            type: Object
        }
    }
};
</script>

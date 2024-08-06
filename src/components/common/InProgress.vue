<template>
    <EmptyData no-rounded>
        <template #image>
            <i class="fa-solid fa-code mb-3" style="font-size: 80px"></i>
        </template>
        В разработке..
    </EmptyData>
</template>
<script>
import EmptyData from '@/components/common/EmptyData.vue';

export default {
    name: 'InProgress',
    components: { EmptyData }
};
</script>

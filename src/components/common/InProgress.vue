<template>
    <EmptyData no-rounded>
        <template #image>
            <img src="@/assets/image/in-progress.gif" alt="in progress image" />
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

<template>
    <div class="calendar">
        <h1>Календарь</h1>
        <InProgress />
    </div>
</template>

<script>
import InProgress from '@/components/common/InProgress.vue';

export default {
    name: 'Calendar',
    components: { InProgress }
};
</script>

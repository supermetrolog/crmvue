<template>
    <div class="messenger-page-loader">
        <Spinner />
    </div>
</template>
<script>
import Spinner from '@/components/common/Spinner.vue';

export default {
    name: 'MessengerPanelLoader',
    components: { Spinner }
};
</script>

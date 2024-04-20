<template>
    <div class="messenger-page-loader">
        <Spinner class="spinner--green" />
    </div>
</template>
<script>
import Spinner from '@/components/common/Spinner.vue';

export default {
    name: 'MessengerChatLoader',
    components: { Spinner }
};
</script>

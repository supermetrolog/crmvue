<template>
    <div class="messenger-aside">
        <MessengerAsideHeader />
        <div class="messenger-aside__body"></div>
    </div>
</template>
<script>
import MessengerAsideHeader from '@/components/Messenger/Aside/MessengerAsideHeader.vue';
export default {
    name: 'MessengerAside',
    components: {
        MessengerAsideHeader
    }
};
</script>

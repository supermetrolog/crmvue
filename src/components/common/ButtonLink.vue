<template>
    <router-link :to="to">
        <Button v-bind="$attrs">
            <slot />
        </Button>
    </router-link>
</template>
<script>
import Button from '@/components/common/Button.vue';

export default {
    name: 'ButtonLink',
    components: {
        Button
    },
    props: {
        to: {
            type: String,
            default: '/'
        }
    }
};
</script>
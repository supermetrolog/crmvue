<template>
    <VTabs ref="tabs" @clicked="handler" :class="{ closed: closed }" v-bind="$attrs">
        <Tab v-if="closed" id="hidden-tab" nav-item-class="hidden-tab" name="hidden-tab">
            Hidden tab
        </Tab>
        <slot />
    </VTabs>
</template>
<script>
import { Tabs as VTabs } from 'vue3-tabs-component';

export default {
    name: 'Tabs',
    components: { VTabs },
    props: {
        closed: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        handler() {
            if (this.closed) this.$refs.tabs.selectTab('#hidden-tab');
        }
    },
    mounted() {
        if (this.closed) {
            this.$refs.tabs.selectTab();
        }
    }
};
</script>

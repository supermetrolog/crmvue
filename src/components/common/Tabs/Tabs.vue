<template>
    <VTabs
        ref="tabs"
        @clicked="handler"
        @changed="changed"
        :class="{ closed: closed }"
        :cache-lifetime="0"
        :options="{ useUrlFragment: false }"
        v-bind="$attrs"
    >
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
    emits: ['changed'],
    props: {
        closed: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        handler() {
            if (this.closed) this.$refs.tabs.selectTab('#hidden-tab');
        },
        selectTab(hash) {
            this.$refs.tabs.selectTab(hash);
            this.$nextTick(() => {
                document.querySelector(hash + '-pane').scrollIntoView({ behavior: 'smooth' });
            });
        },
        changed(event) {
            this.$emit('changed', event.tab.computedId);
        }
    },
    mounted() {
        if (this.closed) {
            this.$refs.tabs.selectTab();
        }
    }
};
</script>

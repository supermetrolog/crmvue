<template>
    <VTabs
        ref="tabs"
        @clicked="handler"
        @changed="onChange"
        :class="{ closed: closed, sticky: sticky }"
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
<script setup>
import { Tabs as VTabs } from 'vue3-tabs-component';
import { nextTick, onMounted, provide, ref, toRef } from 'vue';

const emit = defineEmits(['changed']);
const props = defineProps({
    closed: Boolean,
    alwaysRender: Boolean,
    withTransition: Boolean,
    sticky: Boolean,
    transitionSpeed: {
        type: Number,
        default: 2
    }
});

provide('always-render', props.alwaysRender);
provide('with-transition', props.withTransition);
provide(
    'transition-speed',
    toRef(() => props.transitionSpeed)
);

const tabs = ref(null);

const selectTab = hash => {
    tabs.value.selectTab(hash);
    nextTick(() => {
        document.querySelector(hash + '-pane').scrollIntoView({ behavior: 'smooth' });
    });
};

defineExpose({
    selectTab
});

const handler = () => {
    if (props.closed) tabs.value.selectTab('#hidden-tab');
};

const onChange = event => {
    emit('changed', event.tab.computedId);
};

onMounted(() => {
    if (props.closed) tabs.value.selectTab();
});
</script>

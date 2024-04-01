<template>
    <ExtDropdown ref="dropdown" @visible-change="visibleHandler">
        <template #trigger>
            <slot name="trigger" />
        </template>
        <slot />
    </ExtDropdown>
</template>
<script>
import ExtDropdown from 'v-dropdown';
export default {
    name: 'VDropdown',
    components: { ExtDropdown },
    methods: {
        eventListener(event) {
            event.stopPropagation();
            if (event.code === 'Escape') this.$refs.dropdown.close();
        },
        visibleHandler(visible) {
            if (visible) document.addEventListener('keydown', this.eventListener, true);
            else document.removeEventListener('keydown', this.eventListener, true);
        }
    }
};
</script>

<template>
    <component
        :is="as"
        v-bind="as === 'a' ? { href: companyUrl } : null"
        target="_blank"
        class="company-logo"
    >
        <LazyImage v-if="src" :src="src" class="company-logo__image" :alt="alt" />
        <NoImage v-else :alt="alt" />
    </component>
</template>
<script setup>
import { computed } from 'vue';
import { getLinkCompany } from '@/utils/url.js';
import NoImage from '@/components/common/NoImage.vue';
import LazyImage from '@/components/common/LazyImage.vue';

const props = defineProps({
    src: {
        type: [String, null],
        required: true
    },
    companyId: {
        type: Number,
        required: true
    },
    companyName: {
        type: String,
        default: null
    },
    size: {
        type: Number,
        default: 100
    },
    as: {
        type: String,
        default: 'a'
    }
});

const companyUrl = computed(() => getLinkCompany(props.companyId));
const alt = computed(
    () => `Логотип компании #${props.companyId}, ${props.companyName ?? 'без названия'}`
);

const _size = computed(() => props.size + 'px');
</script>
<style scoped>
.company-logo {
    height: v-bind(_size);
    width: v-bind(_size);
}
</style>

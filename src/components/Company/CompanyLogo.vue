<template>
    <component
        :is="as"
        v-bind="as === 'a' ? { href: companyUrl } : null"
        target="_blank"
        class="company-logo"
    >
        <LazyImage v-if="src" ref="imageEl" :src="src" class="company-logo__image" :alt="alt" />
        <NoImage v-else :alt="alt" />
    </component>
</template>
<script setup>
import { computed, useTemplateRef } from 'vue';
import { getLinkCompany } from '@/utils/url.js';
import NoImage from '@/components/common/NoImage.vue';
import LazyImage from '@/components/common/LazyImage.vue';

const props = defineProps({
    src: String,
    companyId: {
        type: Number,
        required: true
    },
    companyName: String,
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

const imageEl = useTemplateRef('imageEl');

function getImage() {
    return imageEl.value?.$el ?? null;
}

defineExpose({ getImage });
</script>
<style scoped>
.company-logo {
    height: v-bind(_size);
    width: v-bind(_size);
}
</style>

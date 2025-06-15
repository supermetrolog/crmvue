<template>
    <div class="clamped">
        <p ref="content" class="content"><slot /></p>
        <button v-if="isClamped" @click="toggleExpand" :class="buttonClass">
            {{ isExpanded ? hideText : expandText }}..
        </button>
    </div>
</template>
<script setup>
import { computed, ref, useTemplateRef } from 'vue';
import { isNullish } from '@/utils/helpers/common/isNullish.js';

const emit = defineEmits(['expanded', 'hidden']);
const props = defineProps({
    expandText: {
        type: String,
        default: 'Показать всё'
    },
    hideText: {
        type: String,
        default: 'Скрыть всё'
    },
    mode: {
        type: String,
        default: 'expand'
    },
    rows: {
        type: Number,
        default: 3
    },
    buttonClass: [Array, Object, String]
});

const isExpanded = ref(false);

function toggleExpand() {
    if (props.mode === 'expand') {
        isExpanded.value = !isExpanded.value;

        emit(isExpanded.value ? 'expanded' : 'hidden');
    }
}

const currentRows = computed(() => (isExpanded.value ? null : props.rows));
const overflow = computed(() => (isExpanded.value ? 'auto' : 'hidden'));

const content = useTemplateRef('content');

const isClamped = computed(() => {
    if (isNullish(content.value)) {
        return false;
    }

    return content.value.scrollHeight > content.value.clientHeight;
});
</script>
<style scoped>
.content {
    text-overflow: ellipsis;
    max-width: 100%;
    display: -webkit-box;
    -webkit-line-clamp: v-bind(currentRows);
    line-clamp: v-bind(currentRows);
    -webkit-box-orient: vertical;
    overflow-y: v-bind(overflow);
}

button {
    cursor: pointer;
    background-color: transparent;
    border: none;
    box-shadow: none;
    outline: none;
    width: fit-content;
    display: inline-block;
    color: #4b8aeb;
    padding: 0;
}

button:hover {
    text-decoration: underline;
}
</style>

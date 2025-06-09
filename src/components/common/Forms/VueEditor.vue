<template>
    <div>
        <div
            class="vue-editor"
            :class="{ 'vue-editor--invalid': hasValidationError && !disabled, toolbar }"
        >
            <p v-if="label" @click="focus" class="vue-editor__label mb-1" :class="{ required }">
                {{ label }}
            </p>
            <div ref="editor"></div>
            <ValidationMessage v-if="hasValidationError && !disabled" :message="error" />
            <slot name="after" />
        </div>
    </div>
</template>
<script setup>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import Quill from 'quill';
import {
    computed,
    onBeforeUnmount,
    onMounted,
    onUnmounted,
    toRef,
    useTemplateRef,
    watch
} from 'vue';
import { useFormControlValidation } from '@/composables/useFormControlValidation.js';
import ValidationMessage from '@/components/common/Forms/VaildationMessage.vue';
import { useDebounceFn } from '@vueuse/core';

const emit = defineEmits(['ready', 'change', 'blur', 'focus']);

const modelValue = defineModel({ type: String });

const props = defineProps({
    disabled: Boolean,
    required: Boolean,
    label: String,
    minHeight: {
        type: Number,
        default: 100
    },
    maxHeight: {
        type: Number,
        default: 400
    },
    v: Object,
    placeholder: String,
    toolbar: {
        type: Boolean,
        default: true
    },
    autofocus: Boolean,
    debounce: Number
});

const defaultOptions = {
    formats: [
        'bold',
        'color',
        'font',
        'italic',
        'link',
        'size',
        'strike',
        'underline',
        'blockquote',
        'indent',
        'list',
        'align',
        'direction'
    ],
    theme: 'snow',
    modules: {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
            ['blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
            [{ color: [] }],
            ['link'],
            ['clean']
        ]
    }
};

const editor = useTemplateRef('editor');

const state = {
    editorOption: {},
    quill: null
};

let content = '';

watch(modelValue, () => {
    if (state.quill) {
        if (modelValue.value && modelValue.value !== content) {
            content = modelValue.value;
            state.quill.clipboard.dangerouslyPasteHTML(modelValue.value);
        } else if (!modelValue.value || modelValue.value?.length === 0)
            state.quill.clipboard.dangerouslyPasteHTML('');
    }
});

watch(
    () => props.disabled,
    () => {
        if (props.disabled) state.quill.disable();
        else state.quill.enable();
    }
);

const focus = () => {
    if (state.quill) state.quill.focus();
};

defineExpose({ focus });

watch(toRef(props, 'placeholder'), value => {
    state.editorOption.placeholder = value;
});

watch(toRef(props, 'disabled'), value => {
    state.editorOption.readOnly = value;
});

const initialize = () => {
    if (!editor.value) return;

    state.editorOption = defaultOptions;
    state.editorOption.readOnly = props.disabled;
    state.editorOption.placeholder = props.placeholder;

    state.quill = new Quill(editor.value, state.editorOption);

    if (modelValue.value) state.quill.clipboard.dangerouslyPasteHTML(modelValue.value);

    state.quill.on('selection-change', range => {
        if (range) emit('focus', state.quill);
        else emit('blur', state.quill);
    });

    state.quill.on(
        'text-change',
        props.debounce ? useDebounceFn(onTextChange, props.debounce) : onTextChange
    );

    emit('ready', state.quill);

    if (props.autofocus) {
        focus();
    }
};

function onTextChange() {
    let html = state.quill.getSemanticHTML();
    const text = state.quill.getText().trim();

    if (text.length === 0 && !html.includes('img')) html = '';

    content = html;
    modelValue.value = content;

    if (props.v) validate();

    emit('change', { html, text });
}

onMounted(() => {
    initialize();
});

onBeforeUnmount(() => {
    const editorToolbar = editor.value.previousSibling;

    if (
        editorToolbar &&
        editorToolbar.nodeType === 1 &&
        editorToolbar.className.indexOf('ql-toolbar') > -1
    ) {
        editorToolbar.parentNode.removeChild(editorToolbar);
    }
});

onUnmounted(() => {
    state.quill = null;
});

const { hasValidationError, validate, error } = useFormControlValidation(
    toRef(props, 'v'),
    modelValue
);

const minHeightPx = computed(() => props.minHeight + 'px');
const maxHeightPx = computed(() => props.maxHeight + 'px');
</script>
<style>
.vue-editor .ql-editor {
    min-height: v-bind(minHeightPx);
    max-height: v-bind(maxHeightPx);
}
</style>

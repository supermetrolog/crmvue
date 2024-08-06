<template>
    <div>
        <div class="vue-editor">
            <p v-if="label" @click="focus" class="vue-editor__label mb-1">{{ label }}</p>
            <div ref="editor"></div>
        </div>
    </div>
</template>
<script setup>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import Quill from 'quill';
import { onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue';

const emit = defineEmits(['ready', 'change', 'blur', 'focus']);
const modelValue = defineModel({ type: String, default: null });
const props = defineProps({
    disabled: {
        type: Boolean,
        default: false
    },
    label: {
        type: String,
        default: null
    }
});

const defaultOptions = {
    theme: 'snow',
    modules: {
        toolbar: [
            [{ header: [false, 1, 2, 3, 4, 5, 6] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
            ['blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ color: [] }, { background: [] }],
            ['link', 'image', 'video'],
            ['clean']
        ]
    }
};

const editor = ref(null);
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

const initialize = () => {
    if (editor.value) {
        state.editorOption = defaultOptions;
        state.editorOption.readOnly = props.disabled;

        state.quill = new Quill(editor.value, state.editorOption);

        if (modelValue.value) state.quill.clipboard.dangerouslyPasteHTML(modelValue.value);

        state.quill.on('selection-change', range => {
            if (range) emit('focus', state.quill);
            else emit('blur', state.quill);
        });

        state.quill.on('text-change', () => {
            let html = state.quill.getSemanticHTML();
            const text = state.quill.getText().trim();

            if (text.length === 0 && !html.includes('img')) html = '';

            content = html;
            modelValue.value = content;

            emit('change', { html, text });
        });

        emit('ready', state.quill);
    }
};

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
</script>

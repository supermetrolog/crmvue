<template>
    <div class="copy-field">
        <slot />
        <button
            v-tippy="'Нажмите, чтобы скопировать'"
            @click.stop="copy"
            class="copy-field__button"
        >
            <i class="fa-solid fa-copy" />
        </button>
    </div>
</template>
<script setup>
import { useNotify } from '@/utils/use/useNotify.js';

const props = defineProps({
    value: {
        type: [String, Number],
        default: null
    },
    message: {
        type: String,
        default: 'Значение скопировано'
    }
});

const notify = useNotify();

async function copy() {
    await navigator.clipboard.writeText(props.value);
    notify.info(props.message);
}
</script>

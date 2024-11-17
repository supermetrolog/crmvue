<template>
    <a @click.prevent="openExternal" href="#" class="phone-number" :class="classList">
        {{ phoneText }}
    </a>
</template>

<script setup>
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import { computed } from 'vue';

const emit = defineEmits(['created-contact']);
const props = defineProps({
    phone: {
        type: Object,
        default: null
    },
    text: {
        type: String,
        default: null
    },
    contact: {
        type: Object,
        default: null
    },
    classList: {
        type: String,
        default: 'text-center'
    },
    readOnly: {
        type: Boolean,
        default: false
    },
    clickable: {
        type: Boolean,
        default: false
    },
    hidden: {
        type: Boolean,
        default: false
    }
});

const { show } = useAsyncPopup('PhoneNumber');

const phoneText = computed(() => {
    if (props.text) return props.text;

    let name = props.phone.phone;

    if (props.hidden) name = name.slice(0, -4) + '...';

    if (props.phone.exten) name += ' => ' + props.phone.exten;
    return name;
});

const openExternal = async () => {
    if (props.clickable) return;

    const newContactCreated = await show({
        phone: props.phone,
        contact: props.contact,
        classList: props.classList,
        readOnly: props.readOnly
    });

    if (newContactCreated) emit('created-contact');
};
</script>

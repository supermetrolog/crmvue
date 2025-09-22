<template>
    <qrcode-vue :value
:size
:image-settings
render-as="svg"
:class="{ 'op-5': disabled }" />
</template>
<script setup lang="ts">
import QrcodeVue, { ImageSettings } from 'qrcode.vue';

type UiQRCodeProps = {
    value: string;
    size?: number;
    disabled?: boolean;
};

withDefaults(defineProps<UiQRCodeProps>(), {
    size: 200
});

const imageSettings = {
    src: '/favicon.svg',
    height: 30,
    width: 30,
    excavate: true
} satisfies ImageSettings;
</script>

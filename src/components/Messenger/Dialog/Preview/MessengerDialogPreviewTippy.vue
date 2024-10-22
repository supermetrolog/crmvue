<template>
    <tippy placement="left" tag="div" class="messenger-dialog-preview__with-tippy">
        <template #default>
            <slot name="trigger" />
        </template>
        <template #content>
            <slot name="content" />
        </template>
    </tippy>
</template>
<script setup>
import { Tippy } from 'vue-tippy';
</script>

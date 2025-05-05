<template>
    <EmptyData no-rounded>
        <template #image>
            <i class="fa-solid fa-code mb-3" style="font-size: 80px"></i>
        </template>
        <slot>В разработке..</slot>
    </EmptyData>
</template>
<script setup>
import EmptyData from '@/components/common/EmptyData.vue';
</script>

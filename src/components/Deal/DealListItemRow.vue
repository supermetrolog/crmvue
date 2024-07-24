<template>
    <div class="col-4 text-right pr-2">
        <p>{{ label }}:</p>
    </div>
    <div class="col-8 pl-4">
        <strong>
            <slot>—</slot>
        </strong>
    </div>
</template>
<script setup>
defineProps({
    label: {
        type: String,
        required: true
    }
});
</script>

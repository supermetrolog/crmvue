<template>
    <div class="d-flex flex-column">
        <p class="font-weight-semi">
            <span>{{ option.label ?? '- Без измени' }}</span>
            <i v-if="option.isMain" class="fa-solid fa-crown ml-2" />
        </p>
        <p class="fs-2">
            Компания: <span class="font-weight-semi">{{ option.company }}</span>
        </p>
    </div>
</template>
<script setup>
defineProps({
    option: {
        type: Object,
        required: true
    }
});
</script>

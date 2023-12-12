<template>
    <Button icon title="Обновить" @click="$emit('click')">
        <span>Обновить</span>
        <i class="fa-solid fa-rotate"></i>
    </Button>
</template>

<script>
import Button from "@/components/common/Button.vue";

export default {
    name: "RefreshButton",
    components: {Button},
};
</script>

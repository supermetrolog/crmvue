<template>
    <div class="messenger-chat-label messenger-chat-label--row">
        {{ label }}
    </div>
</template>
<script setup>
defineProps({
    label: String
});
</script>

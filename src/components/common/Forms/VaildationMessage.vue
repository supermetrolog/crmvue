<template>
    <span class="form__error">{{ $formatter.text().ucFirst(message) }}</span>
</template>
<script>
export default {
    name: 'ValidationMessage',
    props: {
        message: {
            type: String,
            required: true
        }
    }
};
</script>

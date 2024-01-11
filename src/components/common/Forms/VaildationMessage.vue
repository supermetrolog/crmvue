<template>
    <p class="form__error">{{ $formatter.text().ucFirst(message) }}</p>
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

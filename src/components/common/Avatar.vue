<template>
    <div class="avatar" :style="{ '--size': size + 'px' }">
        <VLazyImage
            @error="hasError = true"
            class="avatar__image"
            :src="hasError ? $url.api.fileNotFound() : $url.api.getUserAvatar(src)"
        />
    </div>
</template>
<script>
import VLazyImage from 'v-lazy-image';
export default {
    name: 'Avatar',
    components: { VLazyImage },
    props: {
        src: {
            type: String,
            default: null
        },
        size: {
            type: [String, Number],
            default: 60
        }
    },
    data() {
        return {
            hasError: false
        };
    }
};
</script>

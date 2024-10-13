<template>
    <Transition name="messenger" appear>
        <div v-if="show" class="messenger-opening-loader">
            <div class="messenger-opening-loader__body">
                <Spinner class="mini" />
                <p>Поиск и загрузка чата..</p>
            </div>
        </div>
    </Transition>
</template>
<script setup>
import Spinner from '@/components/common/Spinner.vue';

defineProps({
    show: {
        type: Boolean,
        default: false
    }
});
</script>
<style>
.messenger-enter-active,
.messenger-leave-active {
    transition: transform 1s ease;
}

.messenger-enter-from {
    transform: translateY(-150px);
}

.messenger-leave-to {
    transform: translateY(-150px);
}
</style>

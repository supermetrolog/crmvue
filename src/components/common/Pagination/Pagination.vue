<template>
    <div v-show="isVisible" class="mt-2">
        <Button v-show="!loading" @click="load" :disabled="disabled" class="w-100" icon>
            <span>Показать ещё</span>
            <i class="fas fa-list-ul"></i>
        </Button>
        <Spinner v-if="loading" />
    </div>
</template>

<script setup>
import Spinner from '@/components/common/Spinner.vue';
import Button from '@/components/common/Button.vue';
import { computed } from 'vue';

const emit = defineEmits(['load-more', 'next']);
const props = defineProps({
    pagination: {
        type: Object
    },
    disabled: {
        type: Boolean,
        default: false
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const isVisible = computed(
    () => props.pagination && props.pagination.pageCount > props.pagination.currentPage
);

const load = async () => {
    if (props.pagination.pageCount <= props.pagination.currentPage) return;

    emit('load-more');
    emit('next', props.pagination.currentPage + 1);
};
</script>

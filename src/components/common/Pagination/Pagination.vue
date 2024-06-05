<template>
    <div v-show="isVisible" class="mt-2">
        <Button v-show="!isLoading" @click="load" :disabled="disabled" class="w-100" icon>
            <span>Показать ещё</span>
            <i class="fas fa-list-ul"></i>
        </Button>
        <Spinner v-if="isLoading" />
    </div>
</template>

<script>
import Spinner from '@/components/common/Spinner.vue';
import Button from '@/components/common/Button.vue';

export default {
    name: 'Pagination',
    components: {
        Button,
        Spinner
    },
    emits: ['load-more', 'next'],
    props: {
        pagination: {
            type: Object
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isLoading: false
        };
    },
    computed: {
        isVisible() {
            if (!this.pagination) return false;
            return this.pagination.pageCount > this.pagination.currentPage;
        }
    },
    methods: {
        async load() {
            if (this.pagination.pageCount > this.pagination.currentPage) {
                this.isLoading = true;

                await this.$emit('load-more');
                await this.$emit('next', this.pagination.currentPage + 1);

                this.isLoading = false;
            }
        }
    }
};
</script>

<style></style>

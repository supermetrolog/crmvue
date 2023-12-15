<template>
    <div v-show="paginationVisible" class="pagination py-4">
        <button v-show="!loader" @click.prevent="clickLoadMore" class="btn btn-primary">
            показать еще
            <i class="fas fa-list-ul d-inline ml-1"></i>
        </button>
        <Loader v-if="loader" class="center small py-4 no-absolute" />
    </div>
</template>

<script>
import Loader from '../Loader.vue';

export default {
    name: 'Pagination',
    components: {
        Loader
    },
    emits: ['loadMore', 'next'],
    props: {
        pagination: {
            type: Object
        }
    },
    data() {
        return {
            loader: false,
            pageNumber: 1
        };
    },
    computed: {
        paginationVisible() {
            if (!this.pagination) {
                return false;
            }
            return this.pagination.pageCount > this.pagination.currentPage ? true : false;
        }
    },
    watch: {
        pagination() {
            this.loader = false;
        }
    },
    methods: {
        clickLoadMore() {
            if (this.pagination.pageCount > this.pagination.currentPage) {
                this.loader = true;
                this.$emit('loadMore');
                this.pageNumber++;
                this.$emit('next', this.pageNumber);
            }
        }
    }
};
</script>

<style></style>
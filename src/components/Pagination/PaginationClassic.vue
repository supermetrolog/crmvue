<template>
    <div class="pagination-classic">
        <div class="pagination-classic__pages">
            <PaginationPage navigate @click="next(1)" :disabled="isFirstPage">
                <i class="fa-solid fa-angles-left"></i>
            </PaginationPage>
            <PaginationPage navigate @click="next(currentPage - 1)" :disabled="isFirstPage">
                <i class="fa-solid fa-angle-left"></i>
            </PaginationPage>
            <PaginationPage
                v-for="number of pageList"
                :key="number"
                :active="number === currentPage"
                @click="next(number)"
            >
                {{ number }}
            </PaginationPage>
            <PaginationPage navigate @click="next(currentPage + 1)" :disabled="isLastPage">
                <i class="fa-solid fa-angle-right"></i>
            </PaginationPage>
            <PaginationPage navigate @click="next(pagination.pageCount)" :disabled="isLastPage">
                <i class="fa-solid fa-angles-right"></i>
            </PaginationPage>
        </div>
        <PaginationDescription
            v-if="withDescription"
            :pagination="pagination"
            :current-page="currentPage"
            :count-visible-rows="countVisibleRows"
        />
    </div>
</template>

<script>
import PaginationPage from "@/components/Pagination/PaginationPage.vue";
import PaginationDescription from "@/components/Pagination/PaginationDescription.vue";

export default {
    name: "PaginationClassic",
    components: {PaginationDescription, PaginationPage},
    data() {
        return {
            currentPage: 1,
            disabled: false,
        };
    },
    props: {
        pagination: {
            totalCount: Number,
            perPage: Number,
            pageCount: Number,
            currentPage: Number
        },
        offset: {
            type: Number,
            default: 2,
        },
        withDescription: {
            type: Boolean,
            default: true,
        },
    },
    computed: {
        isLastPage() {
            return this.pagination.pageCount === this.currentPage || this.pagination.pageCount === 0;
        },
        isFirstPage() {
            return this.currentPage === 1;
        },
        countVisibleRows() {
            const from = this.pagination.perPage * (this.currentPage - 1);
            let to = this.pagination.perPage * this.currentPage;
            if (to > this.pagination.totalCount) {
                to = this.pagination.totalCount;
            }
            return from + " - " + to;
        },
        pageList() {
            let array = [];
            if (!this.pagination) {
                return array;
            }
            const max = +this.pagination.pageCount;
            const min = 1;
            let offset = this.offset,
                leftBorder,
                rightBorder;
            for (let index = 1; index <= max; index++) {
                leftBorder = +this.currentPage - offset;
                rightBorder = +this.currentPage + offset;
                if (leftBorder < min) {
                    rightBorder =
                        rightBorder +
                        Math.abs(leftBorder < 0 ? Math.abs(leftBorder) + min : min);
                }
                if (rightBorder > max) {
                    leftBorder = leftBorder + (max - rightBorder);
                }
                if (leftBorder <= index && rightBorder >= index) {
                    array.push(index);
                }
            }
            return array;
        },
    },
    methods: {
        next(number) {
            if (this.disabled) return;
            this.currentPage = number;
            this.disabled = true;
            this.$emit("next", number);
            setTimeout(() => (this.disabled = false), 300);
        },
    },
    mounted() {
        this.currentPage = +this.pagination.currentPage;
    },
    watch: {
        pagination: {
            deep: true,
            handler() {
                this.currentPage = +this.pagination.currentPage;
            },
        },
    },
    emits: ["next"],
};
</script>

<style>
</style>
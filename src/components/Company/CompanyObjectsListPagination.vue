<template>
    <div class="objects-list__pagination">
        <p>
            <b>{{ pagination.currentPage }}</b> страница из
            <b>{{ pagination.pageCount }};</b>
        </p>
        <p>
            отображение строк
            <b>{{ countVisibleRows }}</b>
            (всего
            <b>{{ pagination.totalCount }}</b>
            )
        </p>
    </div>
</template>

<script>
export default {
    name: 'CompanyObjectsListPagination',
    props: {
        pagination: {
            type: Object,
            required: true
        }
    },
    computed: {
        countVisibleRows() {
            const to = this.pagination.perPage * this.pagination.currentPage;

            if (to > this.pagination.totalCount) return this.pagination.totalCount;
            return to;
        }
    }
};
</script>

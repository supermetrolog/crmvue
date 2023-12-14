<template>
    <div class="pagination-classic__description">
        <span>
            <b>{{ currentPage }}</b> страница из <b>{{ pagination.pageCount }}; </b>
        </span>
        <span>отображение строк <b>{{ countVisibleRows }}</b> (всего <b>{{ pagination.totalCount }}</b>)</span>
    </div>
</template>
<script>

export default {
    name: 'PaginationDescription',
    props: {
        pagination: Object,
        currentPage: Number,
        countVisibleRows: String
    }
}
</script>
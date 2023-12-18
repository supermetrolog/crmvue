<template>
    <div class="objects-list row no-gutters">
        <div class="wrapper col-12 px-3">
            <div class="row no-gutters">
                <div v-if="label" class="col-12 py-3">
                    <h4 class="label">{{ label }}</h4>
                </div>
                <div v-if="!objects.length && !loader" class="col-4 mx-auto">
                    <h3 class="text-warning text-center">НЕТ ДАННЫХ</h3>
                </div>
                <div v-if="pagination && pagination.pageCount" class="col-12 px-2 pagination-params">
                    <p>
                        <b>{{ pagination.currentPage }}</b> страница из
                        <b>{{ pagination.pageCount }};</b>
                    </p>
                    <p>
                        отображение строк
                        <b>{{ countVisibleRows }}</b> (всего <b>{{ pagination.totalCount }}</b
                        >)
                    </p>
                </div>
                <Loader v-if="loader" class="center" />
                <component
                    :is="currentComponent"
                    v-for="object in objects"
                    :key="object.id"
                    @select="$emit('select', $event)"
                    @unSelect="$emit('unSelect', $event)"
                    @addComment="(...argv) => $emit('addComment', ...argv)"
                    @deleteFavoriteOffer="$emit('deleteFavoriteOffer')"
                    :disabled="disabled"
                    :offer="object"
                    :is-selected="!!selectedObjects.find(item => item.id == object.id)"
                    :col="col"
                    :current-step-id="currentStepId"
                    :class-list="
                        currentObjects.find(
                            item =>
                                (item.offer_id == object.original_id || item.offer_id == object.offer_id) &&
                                item.type_id == object.type_id
                        )
                            ? 'success'
                            : ''
                    "
                />
                <div v-if="pagination && pagination.pageCount" class="col-12 px-2 pagination-params">
                    <p>
                        <b>{{ pagination.currentPage }}</b> страница из
                        <b>{{ pagination.pageCount }};</b>
                    </p>
                    <p>
                        отображение строк
                        <b>{{ countVisibleRows }}</b> (всего <b>{{ pagination.totalCount }}</b
                        >)
                    </p>
                </div>
            </div>
        </div>
        <hr v-if="withSeparator && !loader" />
    </div>
</template>

<script>
import CompanyObjectItemOfferOnly from '@/components/Company/Object/CompanyObjectItemOfferOnly.vue';
import Loader from '@/components/common/Loader.vue';

export default {
    name: 'ObjectsList',
    components: {
        Loader,
        CompanyObjectItemOfferOnly
    },
    emits: ['select', 'unSelect', 'addComment', 'deleteFavoriteOffer'],
    props: {
        objects: {
            type: [Array, Boolean],
            default: () => []
        },
        selectedObjects: {
            type: Array,
            default: () => []
        },
        currentObjects: {
            type: Array,
            default: () => []
        },
        disabled: {
            type: Boolean,
            default: false
        },
        selectOnlyOne: {
            type: Boolean,
            default: false
        },
        label: {
            type: String,
            default: null
        },
        withSeparator: {
            type: Boolean,
            default: false
        },
        loader: {
            type: Boolean,
            default: false
        },
        col: {
            type: String,
            default: 'col-6 col-xl-3'
        },
        viewMode: {
            type: Boolean,
            default: false
        },
        pagination: {
            type: Object,
            default: () => {}
        },
        currentStepId: {
            type: Number
        }
    },
    data() {
        return {};
    },
    computed: {
        currentComponent() {
            if (this.viewMode) {
                return 'CompanyObjectItemOfferOnly';
            }
            return 'CompanyObjectItemOfferOnly';
        },
        countVisibleRows() {
            let to = this.pagination.perPage * this.pagination.currentPage;
            if (to > this.pagination.totalCount) {
                to = this.pagination.totalCount;
            }
            return to;
        }
    },
    methods: {
        addComment(object, comment) {
            this.$emit('addComment', object, comment);
        }
    }
};
</script>

<style></style>

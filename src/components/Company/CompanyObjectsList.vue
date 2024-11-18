<template>
    <div class="objects-list row position-relative">
        <div class="col-12">
            <div class="row">
                <div v-if="label" class="col-12">
                    <h4>{{ label }}</h4>
                </div>
                <div v-if="!objects.length && !loader" class="col-12">
                    <EmptyData>Данные отсутствуют</EmptyData>
                </div>
                <CompanyObjectsListPagination
                    v-if="pagination?.pageCount"
                    :pagination="pagination"
                    class="col-12"
                />
                <Loader v-if="loader" />
                <template v-for="object in objects" :key="object.id">
                    <CompanyObjectItemNoOffer
                        v-if="object.noOffer"
                        :offer="object"
                        :class="col"
                        :currentStepID="currentStepId"
                    />
                    <CompanyObjectItemOfferOnly
                        v-else
                        @select="$emit('select', object)"
                        @unselect="$emit('unselect', object)"
                        @addComment="addComment"
                        @deleteFavoriteOffer="$emit('deleteFavoriteOffer')"
                        :disabled="disabled"
                        :offer="object"
                        :is-selected="selectedObjects.some(item => item.id === object.id)"
                        :class="col"
                        :currentStepID="currentStepId"
                    />
                </template>
                <CompanyObjectsListPagination
                    v-if="pagination?.pageCount"
                    :pagination="pagination"
                    class="col-12"
                />
            </div>
        </div>
        <hr v-if="withSeparator && !loader" />
    </div>
</template>

<script setup>
import CompanyObjectItemOfferOnly from '@/components/Company/Object/CompanyObjectItemOfferOnly.vue';
import Loader from '@/components/common/Loader.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import CompanyObjectsListPagination from '@/components/Company/CompanyObjectsListPagination.vue';
import CompanyObjectItemNoOffer from '@/components/Company/Object/CompanyObjectItemNoOffer.vue';

const emit = defineEmits(['select', 'unselect', 'addComment', 'deleteFavoriteOffer']);
defineProps({
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
});

const addComment = (object, comment) => {
    emit('addComment', object, comment);
};
</script>

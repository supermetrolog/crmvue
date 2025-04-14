<template>
    <div class="objects-list position-relative">
        <div class="row">
            <div v-if="label" class="col-12">
                <h4>{{ label }}</h4>
            </div>
            <div v-if="!objects.length && !loader" class="col-12">
                <EmptyData>Данные отсутствуют</EmptyData>
            </div>
            <Loader v-if="loader" />
            <template v-for="object in objects" :key="object.id">
                <CompanyObjectItemNoOffer
                    v-if="object.noOffer"
                    :offer="object"
                    class="objects-list__item"
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
                    class="objects-list__item"
                    :class="col"
                    :currentStepID="currentStepId"
                />
            </template>
        </div>
        <hr v-if="withSeparator && !loader" />
    </div>
</template>

<script setup>
import CompanyObjectItemOfferOnly from '@/components/Company/Object/CompanyObjectItemOfferOnly.vue';
import Loader from '@/components/common/Loader.vue';
import EmptyData from '@/components/common/EmptyData.vue';
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

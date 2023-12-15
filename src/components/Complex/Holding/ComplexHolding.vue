<template>
    <div class="ObjectHolding">
        <div class="ObjectHolding-body">
            <div class="ObjectHolding-carousel">
                <div class="ObjectHolding-label">ID {{ object.id }}</div>
                <Carousel :list="objectPhoto" />
            </div>
            <div class="ObjectHolding-info">
                <div class="ObjectHolding-info-left">
                    <ComplexHoldingParameters :object="object" />
                </div>
                <div class="ObjectHolding-info-right">
                    <ComplexHoldingOwnerList v-if="object.company" :company="object.company" />
                </div>
            </div>
        </div>
        <ComplexHoldingTabs :object="object" />
    </div>
</template>

<script>
import Carousel from '@/components/common/Carousel.vue';
import ComplexHoldingParameters from '@/components/Complex/Holding/ComplexHoldingParameters.vue';
import ComplexHoldingOwnerList from '@/components/Complex/Holding/ComplexHoldingOwnerList.vue';
import ComplexHoldingTabs from '@/components/Complex/Holding/ComplexHoldingTabs.vue';

export default {
    name: 'ComplexHolding',
    components: {
        ComplexHoldingTabs,
        ComplexHoldingOwnerList,
        ComplexHoldingParameters,
        Carousel
    },
    props: {
        object: {
            type: Object,
            required: true
        }
    },
    computed: {
        objectPhoto() {
            return this.object.photo
                ? this.object.photo.map(el => ({
                      src: this.$apiUrlHelper.objectsUrl() + el
                  }))
                : [];
        }
    }
};
</script>

<template>
    <div class="col-10">
        <div v-if="data" class="row">
            <div class="col-4">
                <button @click="clickNegative" class="ml-1 mb-2 action danger" :class="{ active: data.negative }">
                    <i class="far fa-frown-open"></i>
                    <span class="ml-1">Нет подходящих</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { MixinSteps } from '@/components/Timeline/mixins.js';

export default {
    name: 'TimelineStepOffers',
    mixins: [MixinSteps],
    methods: {
        clickNegative() {
            this.data.negative ? (this.data.negative = 0) : (this.data.negative = 1);
            this.$emit('updateItem', this.data);
        }
    }
};
</script>

<style></style>

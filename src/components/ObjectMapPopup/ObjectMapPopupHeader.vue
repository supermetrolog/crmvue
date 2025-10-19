<template>
    <div class="object-map-popup__header">
        <p v-if="object.company" class="font-weight-semi fs-3 text-overflow">
            {{ companyName }}
        </p>
        <p v-if="object.object_class" class="fs-3 text-grey">
            {{ object.object_class_text }} класс
        </p>
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { getCompanyName } from '@/utils/formatters/models/company';
import { IndustryObject } from '@/components/ObjectMapPopup/types';

const props = defineProps<{
    object: IndustryObject;
}>();

const companyName = computed(() => getCompanyName(props.object.company));
</script>
<style lang="scss">
.object-map-popup {
    &__header {
        max-width: calc(100% - 25px);
    }
}
</style>

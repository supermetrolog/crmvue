<template>
    <div class="ObjectHoldings">
        <div class="ObjectHoldings-header">
            <p>СТРОЕНИЯ ({{ buildingsCount }}), УЧАСТКИ ({{ landsCount }})</p>
            <HoverActionsButton
                @click="buildingFormIsVisible = true"
                label="Добавить строение"
                small
            >
                <i class="fas fa-warehouse"></i>
            </HoverActionsButton>
            <HoverActionsButton @click="plotFormIsVisible = true" label="Добавить участок" small>
                <i class="fas fa-tree"></i>
            </HoverActionsButton>
        </div>
        <teleport to="body">
            <FormComplexBuildingCreate
                v-if="buildingFormIsVisible"
                @close="buildingFormIsVisible = false"
            />
            <FormComplexPlotCreate v-if="plotFormIsVisible" @close="plotFormIsVisible = false" />
        </teleport>
        <div class="ObjectHoldings-body">
            <ComplexHolding v-for="object in sortedObjects" :key="object.id" :object="object" />
        </div>
    </div>
</template>

<script setup>
import FormComplexPlotCreate from '@/components/Forms/Complex/FormComplexPlotCreate.vue';
import FormComplexBuildingCreate from '@/components/Forms/Complex/FormComplexBuildingCreate.vue';
import ComplexHolding from '@/components/Complex/Holding/ComplexHolding.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import { computed, shallowRef } from 'vue';

const props = defineProps({
    objects: {
        type: Array,
        default: () => []
    }
});

const buildingFormIsVisible = shallowRef(false);
const plotFormIsVisible = shallowRef(false);

const buildingsCount = computed(() =>
    props.objects.reduce((acc, holding) => acc + Number(!holding.is_land), 0)
);
const landsCount = computed(() => props.objects.length - buildingsCount.value);
const sortedObjects = computed(() => props.objects.toReversed());
</script>

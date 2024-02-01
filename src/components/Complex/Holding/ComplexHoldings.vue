<template>
    <div class="ObjectHoldings">
        <div class="ObjectHoldings-header">
            <p>СТРОЕНИЯ ({{ buildingsCount }}), УЧАСТКИ ({{ landsCount }})</p>
            <div class="ObjectHoldings-header-icons">
                <button @click="clickOpenCreateBuildingForm" class="ObjectHoldings-header-button">
                    <i class="fas fa-warehouse"></i>
                </button>
                <button @click="clickOpenCreatePlotForm" class="ObjectHoldings-header-button">
                    <i class="fas fa-tree"></i>
                </button>
            </div>
        </div>
        <teleport to="body">
            <FormComplexBuildingCreate
                v-if="createBuildingFormVisible"
                @close="clickCloseCreateBuildingForm"
            />
        </teleport>
        <teleport to="body">
            <FormComplexPlotCreate v-if="createPlotFormVisible" @close="clickCloseCreatePlotForm" />
        </teleport>
        <div class="ObjectHoldings-body">
            <ComplexHolding v-for="object in sortedObjects" :key="object.id" :object="object" />
        </div>
    </div>
</template>

<script>
import FormComplexPlotCreate from '@/components/Forms/Complex/FormComplexPlotCreate.vue';
import FormComplexBuildingCreate from '@/components/Forms/Complex/FormComplexBuildingCreate.vue';
import ComplexHolding from '@/components/Complex/Holding/ComplexHolding.vue';

export default {
    name: 'ComplexHoldings',
    components: { ComplexHolding, FormComplexBuildingCreate, FormComplexPlotCreate },
    props: {
        objects: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            createBuildingFormVisible: false,
            createPlotFormVisible: false
        };
    },
    computed: {
        buildingsCount() {
            let buildings = this.objects.filter(holding => holding.object_type.includes(1));
            return buildings.length;
        },
        landsCount() {
            return this.objects.filter(holding => holding.object_type.includes(2)).length;
        },
        sortedObjects() {
            return [...this.objects].reverse();
        }
    },
    methods: {
        clickOpenCreateBuildingForm() {
            this.createBuildingFormVisible = true;
        },
        clickCloseCreateBuildingForm() {
            this.createBuildingFormVisible = false;
        },
        clickOpenCreatePlotForm() {
            this.createPlotFormVisible = true;
        },
        clickCloseCreatePlotForm() {
            this.createPlotFormVisible = false;
        }
    }
};
</script>

<style lang="scss" scoped></style>

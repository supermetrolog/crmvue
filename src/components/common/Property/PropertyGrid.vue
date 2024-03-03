<template>
    <div class="property-grid">
        <div v-for="(chunk, key) in chunks" :key="key" class="property-grid__column">
            <PropertyTable
                v-for="(table, tableKey) in chunk"
                :key="`${key}-${tableKey}`"
                :properties="table.properties"
                :title="table.name"
            />
        </div>
    </div>
</template>

<script>
import PropertyTable from '@/components/common/Property/PropertyTable.vue';
import { alg } from '@/utils/alg';

export default {
    name: 'PropertyGrid',
    components: { PropertyTable },
    props: {
        sections: {
            type: Array,
            required: true
        },
        columns: {
            type: Number,
            default: 2
        },
        template: {
            type: Array,
            default: () => null
        }
    },
    computed: {
        chunks() {
            if (this.template) {
                const formattedSections = this.sections.reduce(
                    (acc, element) => ({ ...acc, [element.id]: element }),
                    {}
                );

                return this.template.map(element =>
                    element.map(tableID => formattedSections[tableID])
                );
            }

            return alg.parts(this.sections, this.columns);
        }
    },
    methods: {}
};
</script>

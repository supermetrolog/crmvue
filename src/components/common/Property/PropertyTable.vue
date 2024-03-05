<template>
    <div class="property-table">
        <p v-if="title" class="property-table__title">{{ title }}</p>
        <ul class="property-table__list">
            <PropertyTableItem
                v-for="(property, key) in properties"
                :key="key"
                :property="property"
            />
        </ul>
    </div>
</template>
<script>
import PropertyTableItem from '@/components/common/Property/PropertyTableItem.vue';

export default {
    name: 'PropertyTable',
    components: { PropertyTableItem },
    props: {
        properties: {
            type: Array,
            required: true
        },
        title: {
            type: String,
            default: null
        }
    }
};
</script>

<template>
    <div class="object-purposes">
        <template v-for="purpose in formattedPurposes" :key="purpose.id">
            <slot name="item" :purpose="purpose" :select="select">
                <ObjectPurpose @click="select(purpose.id)" :purpose="purpose" :class="itemClass" />
            </slot>
        </template>
    </div>
</template>
<script setup>
import ObjectPurpose from '@/components/Object/ObjectPurpose.vue';
import { computed } from 'vue';
import { objectOptions } from '@/const/options/object.options.js';

const emit = defineEmits(['select']);
const props = defineProps({
    purposes: {
        type: Array,
        required: true
    },
    objectTypes: {
        type: Array,
        default: () => [1, 2, 3]
    },
    onlyIncluded: {
        type: Boolean,
        default: false
    },
    formatted: {
        type: Boolean,
        default: false
    },
    size: {
        type: Number,
        default: 40
    },
    itemClass: {
        type: [String, Array, Object],
        default: null
    }
});

const purposeSize = computed(() => props.size + 'px');
const purposeFontSize = computed(() => props.size * 0.5 + 'px');

const purposesCache = computed(() =>
    props.purposes.reduce((acc, element) => {
        acc[element] = true;
        return acc;
    }, {})
);

const _purposes = computed(() => {
    if (props.objectTypes.length === 3) return Object.entries(objectOptions.purposes);

    const acc = {};

    props.objectTypes.forEach(objectTypeId => {
        Object.assign(
            acc,
            objectOptions.purposesWithSections[objectOptions.objectType[objectTypeId]]
        );
    });

    return Object.entries(acc);
});

const formattedPurposes = computed(() => {
    if (props.formatted) return props.purposes;

    if (props.onlyIncluded)
        return props.purposes.map(purposeId => ({
            id: purposeId,
            included: true,
            name: objectOptions.purposes[purposeId].name,
            icon: objectOptions.purposes[purposeId].icon
        }));

    return _purposes.value.map(([key, value]) => ({
        id: Number(key),
        included: purposesCache.value[key],
        name: value.name,
        icon: value.icon
    }));
});

const select = purposeId => {
    emit('select', purposeId);
};
</script>
<style scoped>
.object-purposes {
    --purpose-size: v-bind(purposeSize);
    --purpose-font-size: v-bind(purposeFontSize);
}
</style>

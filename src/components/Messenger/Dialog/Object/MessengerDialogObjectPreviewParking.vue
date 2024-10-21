<template>
    <div class="messenger-dialog-preview-tippy">
        <p class="messenger-dialog-preview-tippy__title mb-2">Информация о парковке:</p>
        <div v-for="parking in parkingTypes" :key="parking.id" class="mb-1">
            <span class="messenger-dialog-preview-tippy__label">{{ parking.label }}: </span>
            <template v-if="object[parking.property]">
                <template v-if="object[parking.property] === 1">
                    <span>есть</span>
                    <template v-if="object[parking.propertyType]">
                        <span v-if="object[parking.propertyType] === 1">, платная</span>
                        <span v-else-if="object[parking.propertyType] === 2">, бесплатная</span>
                    </template>
                    <span v-else class="messenger-warning">, тип оплаты не указан</span>
                </template>
                <span v-else-if="object[parking.property] === 2">нет</span>
            </template>
            <span v-else class="messenger-warning">не указано</span>
        </div>
    </div>
</template>
<script setup>
// TODO: Добавить цену, когда в беке подвезем value на цену, а type на тип оплаты

defineProps({
    object: {
        type: Object,
        required: true
    }
});

const parkingTypes = [
    {
        id: 1,
        label: 'P легковая',
        property: 'parking_car',
        propertyType: 'parking_car_value'
    },
    {
        id: 2,
        label: 'P 3-10 тонн',
        property: 'parking_lorry',
        propertyType: 'parking_lorry_value'
    },
    {
        id: 3,
        label: 'P грузовая',
        property: 'parking_truck',
        propertyType: 'parking_lorry_value'
    }
];
</script>

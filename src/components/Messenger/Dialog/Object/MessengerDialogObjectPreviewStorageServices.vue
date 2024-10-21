<template>
    <div class="messenger-dialog-object-preview-storage-services messenger-dialog-preview-tippy">
        <p class="messenger-dialog-preview-tippy__title">Список услуг:</p>
        <div v-for="(category, key) in categories" :key="key" class="my-2">
            <p class="messenger-dialog-preview-tippy__label mb-1">{{ category.name }}:</p>
            <p v-for="(service, property) in category.properties" :key="property">
                <span
                    class="messenger-dialog-preview-storage-services__item"
                    :class="{ active: offer[property] === 1 }"
                >
                    {{ service.name }}
                </span>
            </p>
        </div>
    </div>
</template>
<script setup>
import { dealProperties } from '@/const/properties/deal.properties.js';

defineProps({
    offer: {
        type: Object,
        required: true
    }
});

const categories = dealProperties.servicesWithCategories;
</script>

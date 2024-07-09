<template>
    <div class="trade-offer-services">
        <div
            v-for="(category, index) in services"
            :key="index"
            class="trade-offer-services__category"
        >
            <p class="trade-offer-services__category">{{ category.name }}</p>
            <ul class="trade-offer-services__list">
                <li
                    v-for="(service, key) in category.properties"
                    :key="`${index}-${key}`"
                    class="trade-offer-services__item"
                >
                    <i v-if="service.icon" :class="service.icon" />
                    <span>{{ service.name }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script setup>
defineProps({
    services: {
        type: Array,
        default: () => []
    }
});
</script>

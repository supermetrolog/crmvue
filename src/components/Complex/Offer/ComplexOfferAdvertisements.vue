<template>
    <div class="trade-offer-advertisements">
        <p class="trade-offer-advertisements__title">Реклама</p>
        <div class="trade-offer-advertisements__list">
            <Tooltip
                v-for="(item, key) in advertisements"
                :key="'adv-' + key"
                class="trade-offer-advertisements__item"
                :class="{ active: isActiveAdv(item) }"
            >
                <template #trigger>
                    <span class="trade-offer-advertisements__header">
                        <i class="fa-solid fa-rocket"></i>
                        <span>{{ item.label }}</span>
                    </span>
                </template>
                <template #content>
                    <ul class="trade-offer-advertisements__grid">
                        <li
                            v-for="(property, index) in item.properties"
                            :key="`adv-${key}-${index}`"
                            class="trade-offer-advertisements__value"
                        >
                            <i
                                v-if="property.value"
                                class="fa-regular fa-square-check trade-offer-advertisements__on"
                            ></i>
                            <i
                                v-else
                                class="fa-regular fa-square-minus trade-offer-advertisements__off"
                            ></i>
                            {{ property.label }}
                        </li>
                    </ul>
                </template>
            </Tooltip>
        </div>
    </div>
</template>
<script>
import Tooltip from '@/components/common/Tooltip.vue';

export default {
    name: 'ComplexOfferAdvertisements',
    components: { Tooltip },
    props: {
        advertisements: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        isActiveAdv(adv) {
            return adv.properties.filter(element => element.value).length;
        }
    }
};
</script>

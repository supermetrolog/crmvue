<template>
    <div class="offer-tabs">
        <Tabs
            :options="{ useUrlFragment: false }"
            nav-class="offers-tabs__list"
            nav-item-link-class="offers-tabs__link"
        >
            <Tab name="Сводка">
                <div class="offers-tabs__tab-body">
                    <ComplexOfferSummary
                        :parameters="parameters.summary.parameters"
                        :description="parameters.summary.description"
                        :plan_scheme="parameters.summary.plan_scheme"
                    />
                </div>
            </Tab>
            <Tab name="Подробно">
                <div class="offers-tabs__tab-body">
                    <ComplexOfferDetails :blocks="parameters.blocks" class="offers-tabs__offer-details" />
                </div>
            </Tab>
            <Tab name="Описание">
                <div class="offers-tabs__tab-body"></div>
            </Tab>
            <Tab name="Фото">
                <div class="offers-tabs__tab-body"></div>
            </Tab>
            <Tab name="Клиенты">
                <div class="offers-tabs__tab-body"></div>
            </Tab>
            <Tab name="Задачи">
                <div class="offers-tabs__tab-body"></div>
            </Tab>
            <Tab name="Парам. Сделки">
                <div class="offers-tabs__tab-body"></div>
            </Tab>
        </Tabs>
    </div>
</template>

<script>
import ComplexOfferSummary from '@/components/Complex/Offer/ComplexOfferSummary.vue';
import ComplexOfferDetails from '@/components/Complex/Offer/ComplexOfferDetails.vue';

export default {
    name: 'ComplexTabs',
    components: { ComplexOfferDetails, ComplexOfferSummary },
    props: {
        parameters: {
            type: Object,
            required: true
        }
    },
    data() {
        return {};
    },
    methods: {}
};
</script>
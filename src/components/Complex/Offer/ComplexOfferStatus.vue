<template>
    <div class="trade-offer-status">
        <p
            class="trade-offer-status__text trade-offer-status__text_label"
            :class="{ 'trade-offer-status__text_color_red': status }"
        >
            {{ offerStatus }}
        </p>
        <p class="trade-offer-status__text">
            {{ offerCompany }}
        </p>
        <p class="trade-offer-status__text">
            {{ offerDate }}
        </p>
        <p class="trade-offer-status__text">
            {{ offerRealtor }}
        </p>
        <p class="trade-offer-status__text">
            {{ offerConsultant }}
        </p>
    </div>
</template>

<script>

export default {
    name: "ComplexOfferStatus",
    components: {},
    props: {
        status: {
            type: Object
        },
    },
    data() {
        return {};
    },
    methods: {},
    computed: {
        offerStatus() {
            return this.status ? "Сделка завершена" : "Активная сделка";
        },
        offerCompany() {
            return this.status
                ? `${this.status.company.organization_type} ${this.status.company.name}`
                : "--";
        },
        offerDate() {
            return this.status
                ? this.$formatter.date().locale(this.status.date)
                : "--";
        },
        offerRealtor() {
            return this.status ? this.status.realtor : "--";
        },
        offerConsultant() {
            return this.status ? this.status.consultant : "--";
        },
    },
};
</script>
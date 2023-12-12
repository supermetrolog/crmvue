<template>
    <div class="CompanyTableObjectOffer mt-0 mb-2 col-12 p-0">
        <div class="object-offer-inf">
            <div>
                <b
                >{{ dealTypeName }}
                    {{ offer.calc_area_general }}
                    м<sup>2</sup>
                </b>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "CompanyTableObjectOffer",
    props: {
        offer: {
            type: Object,
        },
    },
    computed: {
        dealTypeName() {
            let result;
            if (this.offer.deal_type == 1 || this.offer.deal_type == 4) {
                result = "Аренда";
            }
            if (this.offer.deal_type == 2) {
                result = "Продажа";
            }
            if (this.offer.deal_type == 3) {
                result = "О/Х";
            }
            return result;
        },
    },
};
</script>
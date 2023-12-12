<template>
    <div
        class="company-objects-list__item CompanyTableObjectItem px-0"
        :class="col"
    >
        <div class="row no-gutters CompanyTableObjectItem-wrapper">
            <div class="col-2" :title="object.description_auto || 'нет описания'">
                <div class="image-container">
                    <a
                        :href="$apiUrlHelper.generator().objectUrl(object.complex_id)"
                        target="_blank"
                    >
                        <img :src="object.thumb" alt="image"/>
                        <span class="object_id">
              {{ object.id }}
            </span>
                    </a>
                </div>
            </div>
            <div class="col-10 desc row">
                <div class="col-8 scroller">
                    <div class="item__title">
                        <p>{{ $formatter.number(object.area_building) }} м<sup>2</sup></p>
                        <span v-if="objectClass">, класс {{ objectClass }}</span>
                    </div>
                    <div class="address">
                        <p>{{ object.address }}</p>
                    </div>
                </div>
                <div class="col-4 scroller" v-if="activeOfferMix.length">
                    <CompanyTableObjectOffer
                        class="text-center"
                        v-for="offer in activeOfferMix"
                        :key="offer.id"
                        :offer="offer"
                    />
                </div>
                <div
                    class="
            col-4
            text-grey text-center
            none
            d-flex
            justify-content-center
            align-items-center
          "
                    v-else
                >
                    нет активных
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CompanyTableObjectOffer from "./CompanyTableObjectOffer.vue";

export default {
    name: "CompanyTableObjectItem",
    components: {
        CompanyTableObjectOffer,
    },
    props: {
        object: {
            type: Object,
        },
        col: {
            type: String,
            default: "col-6",
        },
    },
    computed: {
        objectClass() {
            let result;
            switch (this.object.object_class) {
                case 0:
                    break;
                case 1:
                    result = "A";
                    break;
                case 2:
                    result = "B";
                    break;
                case 3:
                    result = "C";
                    break;
                case 4:
                    result = "D";
                    break;
            }
            return result;
        },

        activeOfferMix() {
            return this.object.offerMix.filter(
                (offer) => offer.status == 1 && offer.type_id == 2
            );
        },
    },
};
</script>
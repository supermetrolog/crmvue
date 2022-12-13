import { mapGetters, mapActions } from "vuex";
import {
    DirectionList,
    DistrictList,
    RegionList,
    TaxFormList,
} from "@/const/Const.js";
export const MixinOfferItem = {
    data() {
        return {
            dropdownIsOpen: false,
            directionList: DirectionList.get("param"),
            districtList: DistrictList.get("param"),
            regionList: RegionList.get("param"),
            taxFormList: TaxFormList,
        };
    },
    props: {
        offer: {
            type: Object,
        },
    },
    computed: {
        ...mapGetters(["FAVORITES_OFFERS", "THIS_USER"]),
        contact() {
            let contact = this.offer.contact || this.offer.company.mainContact;
            return contact;
        },
    },
    methods: {
        ...mapActions([
            "ADD_FAVORITES_OFFER",
            "DELETE_FAVORITES_OFFERS",
            "SEARCH_FAVORITES_OFFERS",
        ]),
        getOfferUrl(offer) {
            return this.$apiUrlHelper.generator().offerUrl(offer);
        },

        async clickFavoriteOffer(offer) {
            if (!this.FAVORITES_OFFERS.find(
                    (item) => item.original_id == offer.original_id
                )) {
                return this.ADD_FAVORITES_OFFER(offer);
            }
            await this.DELETE_FAVORITES_OFFERS(offer);
            this.$emit("deleteFavoriteOffer", offer);
        },
        clickViewPdf(offer) {
            let url =
                this.$apiUrlHelper.url() +
                `pdf/presentations?type_id=${offer.type_id}&original_id=${offer.original_id}&object_id=${offer.object_id}&consultant=${this.THIS_USER.userProfile.medium_name}`;
            console.error(url);
            window.open(url, "_blank");
        },
    },
};
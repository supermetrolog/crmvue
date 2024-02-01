import { mapActions, mapGetters } from 'vuex';
import { DirectionList, DistrictList, RegionList, TaxFormList } from '@/const/const.js';

export const MixinOfferItem = {
    data() {
        return {
            dropdownIsOpen: false
        };
    },
    props: {
        offer: {
            type: Object
        }
    },
    computed: {
        ...mapGetters(['FAVORITES_OFFERS', 'THIS_USER']),
        directionList: () => DirectionList,
        districtList: () => DistrictList,
        regionList: () => RegionList,
        taxFormList: () => TaxFormList,
        contact() {
            let contact = this.offer.contact || this.offer.company.mainContact;
            return contact;
        }
    },
    methods: {
        ...mapActions([
            'ADD_FAVORITES_OFFER',
            'DELETE_FAVORITES_OFFERS',
            'SEARCH_FAVORITES_OFFERS'
        ]),
        getOfferUrl(offer) {
            return this.$apiUrlHelper.generator().offerUrl(offer);
        },
        getOldOfferUrl(offer) {
            return this.$apiUrlHelper.generator().offerUrlOld(offer);
        },
        async clickFavoriteOffer(offer) {
            if (!this.FAVORITES_OFFERS.find(item => item.original_id == offer.original_id)) {
                return this.ADD_FAVORITES_OFFER(offer);
            }
            await this.DELETE_FAVORITES_OFFERS(offer);
            this.$emit('deleteFavoriteOffer', offer);
        },
        clickViewPdf(offer) {
            window.open(this.$apiUrlHelper.generator().pdfUrl(offer, this.THIS_USER.id), '_blank');
        }
    }
};

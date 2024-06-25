import { mapActions, mapGetters } from 'vuex';

export const MixinOfferItem = {
    emits: ['favorite-deleted'],
    inject: ['$openMessengerChat'],
    data() {
        return {
            dropdownIsOpen: false
        };
    },
    props: {
        offer: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters({ currentUser: 'THIS_USER' }),
        contact() {
            return this.offer.contact || this.offer.company?.mainContact;
        },
        isFavorite() {
            return this.$store.state.Offers.favoritesOffersCache[this.offer.original_id];
        },
        isPassive() {
            return this.offer.status !== 1;
        }
    },
    methods: {
        ...mapActions([
            'ADD_FAVORITES_OFFER',
            'DELETE_FAVORITES_OFFERS',
            'SEARCH_FAVORITES_OFFERS'
        ]),
        async toggleFavorite() {
            if (!this.isFavorite) return this.ADD_FAVORITES_OFFER(this.offer);
            await this.DELETE_FAVORITES_OFFERS(this.offer);
            this.$emit('favorite-deleted', this.offer);
        },
        openPDF() {
            window.open(
                this.$url.pdf(
                    {
                        type_id: 2,
                        offer_id: this.offer.original_id,
                        object_id: this.offer.object_id
                    },
                    this.currentUser.id
                ),
                '_blank'
            );
        },
        openInChat() {
            this.$openMessengerChat({
                companyID: this.offer.company_id,
                objectID: this.offer.object_id
            });
        }
    }
};

import api from '@/api/api';

const Offers = {
    namespaced: true,
    state: {
        mixer: [],
        complex: null
    },
    mutations: {
        setComplex(state, complex) {
            state.mixer = [];

            if (complex && complex.mixer_parts) {
                const mixer = JSON.parse(complex.mixer_parts);

                complex.objects.forEach(object => {
                    object.floorsRecords.forEach(floor => {
                        floor.parts.forEach(part => {
                            part.checked = mixer.includes(part.id);
                        });
                    });
                });

                complex.objects.forEach(object => {
                    object.commercialOffers.forEach(offer => {
                        const calculatedPrice = { min: null, max: null };
                        const calculatedArea = { min: null, max: null };

                        offer.blocks.forEach(block => {
                            if (block.is_solid && !block.deleted) {
                                calculatedArea.min = calculatedArea.min
                                    ? Math.min(calculatedArea.min, block.area_min)
                                    : block.area_min;
                                calculatedArea.max += block.area_max;

                                switch (offer.deal_type) {
                                    case 1: {
                                        calculatedPrice.min = calculatedPrice.min
                                            ? Math.min(calculatedPrice.min, block.price_floor_min)
                                            : block.price_floor_min;
                                        calculatedPrice.max = Math.max(
                                            calculatedPrice.max,
                                            block.price_floor_max
                                        );
                                        break;
                                    }
                                    case 2: {
                                        calculatedPrice.min = calculatedPrice.min
                                            ? Math.min(calculatedPrice.min, block.price_sale_min)
                                            : block.price_sale_min;
                                        calculatedPrice.max = Math.max(
                                            calculatedPrice.max,
                                            block.price_sale_max
                                        );
                                        break;
                                    }
                                    default: {
                                        break;
                                    }
                                }
                            }
                        });

                        offer.calculated_area_max = calculatedArea.max;
                        offer.calculated_area_min = calculatedArea.min;
                        offer.calculated_price_max = calculatedPrice.max;
                        offer.calculated_price_min = calculatedPrice.min;
                    });
                });

                state.mixer = mixer;
            }

            state.complex = complex;
        }
    },
    actions: {
        async FETCH_COMPLEX(context, id) {
            const complex = (await api.complex.getComplexWithObjects(id)).data;
            context.commit('setComplex', complex);

            return complex;
        },
        async DELETE_COMPLEX({ commit }, id) {
            console.log('Delete complex #' + id);
            commit('setComplex', null);
        }
    }
};

export default Offers;

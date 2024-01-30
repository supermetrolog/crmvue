import api from '@/api/api';

const Offers = {
    namespaced: true,
    state: {
        mixer: [],
        complex: null
    },
    mutations: {
        setComplex(state, complex) {
            state.mixer = []

            if (complex && complex.mixer_parts) {
                const mixer = JSON.parse(complex.mixer_parts);

                complex.objects.forEach(object => {
                    object.floorsRecords.forEach(floor => {
                        floor.parts.forEach(part => {
                            part.checked = mixer.includes(part.id);
                        });
                    });
                });

                const filteredParts = {};

                complex.objects.forEach(object => {
                    object.floorsRecords.forEach(floor =>
                        floor.parts.forEach(part => {
                            if (part.offer_id in filteredParts)
                                filteredParts[part.offer_id].push(part);
                            else filteredParts[part.offer_id] = [part];
                        })
                    );
                });

                complex.objects.forEach(object => {
                    object.commercialOffers.forEach(offer => {
                        offer.calculated_area_min = filteredParts[offer.id].reduce(
                            (acc, part) =>
                                part.checked
                                    ? acc + (part.area_floor_min || part.area_mezzanine_min || 0)
                                    : acc,
                            0
                        );

                        offer.calculated_area_max = filteredParts[offer.id].reduce(
                            (acc, part) =>
                                part.checked
                                    ? acc + (part.area_floor_max || part.area_mezzanine_max || 0)
                                    : acc,
                            0
                        );
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
        async DELETE_COMPLEX({commit}, id) {
            console.log('Delete complex #' + id);
            commit('setComplex', null);
        }
    }
};

export default Offers;

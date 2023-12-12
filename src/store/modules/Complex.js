import api from "@/api/api";

const Offers = {
    state: {

    },
    mutations: {

    },
    actions: {
        async FETCH_COMPLEX(context, id) {
            return (await api.complex.getComplexWithObjects(id)).data;
        }
    },
    getters: {

    },
};

export default Offers;

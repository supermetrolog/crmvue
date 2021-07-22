import axios from "axios"

const CompanyRequestForm = {
    state: {
        consultantList: [],
    },
    mutations: {
        updateConsultantList(state, data) {
            data.map(item => {
                state.consultantList.push({
                    value: item.id,
                    label: item.username
                })
            });
        },
    },
    actions: {
        async FETCH_CONSULTANT_LIST(context) {
            const url = "users?fields=id,username";
            await axios
                .get(url)
                .then((Response) => {
                    context.commit('updateConsultantList', Response.data)
                });
        }
    },
    getters: {
        CONSULTANT_LIST(state) {
            return state.consultantList;
        }
    }
}

export default CompanyRequestForm;
const CompanyForm = {
    state: {
        form: {
            nameEng: "",
            nameRu: "",
            noName: false,
            formOfOrganization: 0,
            companyGroup: "",
            category: [], // -
            officeAdress: "",
            siteList: [""], // -
            phoneList: [""], // -
            emailList: [""], // -
            status: null,
            consultant: null,
            legalAddress: "",
            ogrn: "",
            inn: "",
            kpp: "",
            checkingAccount: "",
            correspondentAccount: "",
            inTheBank: "",
            bik: "",
            okved: "",
            okpo: "",
            signatoryName: "",
            signatoryMiddleName: "",
            signatoryLastName: "",
            basis: "",
            documentNumber: "",
            activityGroup: null,
            activityProfile: null,
            productRange: [], // -
            desctiption: "",
            files: "sdawda",
        },
    },
    mutations: {
        addProductRangeItem(state, newItem) {
            state.form.productRange.push(newItem);
        },
        deleteProductRangeItem(state, index) {
            state.form.productRange = state.form.productRange.filter((item, idx) => idx != index);
        }
    },
    actions: {
        ADD_PRODUCT_RANGE_ITEM(context, newItem) {
            context.commit('addProductRangeItem', newItem);
        },
        DELETE_PRODUCT_RANGE_ITEM(context, index) {
            context.commit('deleteProductRangeItem', index);
        }
    },
    getters: {
        FORM(state) {
            return state.form
        },
        MAIN(state) {
            return state.form
        },
        REQUISISTES(state) {
            return state.form
        },
        ACTIVITY(state) {
            return state.form
        }
    }
}

export default CompanyForm;
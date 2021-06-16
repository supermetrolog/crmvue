const CompanyForm = {
    state: {
        form: {
            main: {
                nameEng: "",
                nameRu: "",
                noName: false,
                formOfOrganization: 0,
                companyGroup: "",
                category: [],
                officeAdress: "",
                siteList: [""],
                phoneList: [""],
                emailList: [""],
                status: false,
                consultant: "",
                processed: false,
            },

        },
    },
    mutations: {

    },
    actions: {

    },
    getters: {
        FORM(state) {
            return state.form
        },
        MAIN(state) {
            return state.form.main
        }
    }
}

export default CompanyForm;
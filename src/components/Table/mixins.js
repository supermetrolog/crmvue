export default {
    props: {
        sort: {
            type: String,
        },
        withRouter: {
            type: Boolean,
            default: true,
        },
    },
    computed: {
        sort_desc() {
            if (!this.withRouter) return false; // Это временно
            let query = {...this.$route.query };
            if (!query.sort) return false;
            const words = query.sort.split(",");
            const existThisSortInCurrent = words.find(
                (item) => item == `-${this.sort}`
            );
            return !!existThisSortInCurrent;
        },
        sort_asc() {
            if (!this.withRouter) return false; // Это временно
            let query = {...this.$route.query };
            if (!query.sort) return false;
            const words = query.sort.split(",");
            const existThisSortInCurrent = words.find((item) => item == this.sort);
            return !!existThisSortInCurrent;
        },
    },

}
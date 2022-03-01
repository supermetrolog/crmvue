export const TableContentMixin = {
    data() {
        return {
            mounted: false,
            loader: true,
        }
    },
    methods: {
        async next(number) {
            let query = {...this.$route.query };
            query.page = number;
            await this.$router.push({ query });
        },
        async initialRouteSettings() {
            let query = {...this.$route.query };
            const queryLength = Object.keys(this.$route.query).length;
            if (!queryLength) {
                query.consultant_id = this.THIS_USER.id;
            }
            await this.$router.push({ query });
        },
    },
    async mounted() {
        await this.initialRouteSettings();
        this.mounted = true;
        await this.getContent();
        this.$watch("$route", (newValue, oldValue) => {
            if (newValue.path == oldValue.path) {
                this.getContent();
            }
        });
    },

}
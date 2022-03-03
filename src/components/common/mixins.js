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
            await this.$router.replace({ query });
        },
        async initialRouteSettings() {
            let query = {...this.$route.query };
            const queryLength = Object.keys(this.$route.query).length;
            if (!queryLength) {
                query.consultant_id = this.THIS_USER.id;
            }
            await this.$router.replace({ query });
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

};

import { mapActions, mapGetters } from "vuex";
export const SearchFormMixin = {
    data() {
        return {
            setTimeout: null,
            extraVisible: true,
            form: {...this.$options.defaultFormProperties },
        };
    },

    computed: {
        ...mapGetters(["THIS_USER"]),
        filterCount() {
            let count = 0;
            for (const key in this.$options.defaultFormProperties) {
                if (Object.hasOwnProperty.call(this.form, key)) {
                    const value = this.form[key];
                    if (value !== null && value !== "") {
                        if (Array.isArray(value)) {
                            if (value.length) {
                                count++;
                            }
                        } else {
                            count++;
                        }
                    }
                }
            }
            return count;
        },
    },
    methods: {
        ...mapActions(["FETCH_CONSULTANT_LIST"]),
        onSubmit() {
            let query = {...this.$route.query, ...this.form };
            console.warn(query);
            this.deleteEmptyFields(query);

            query.page = 1;
            this.$router.replace({ query });
        },
        resetForm() {
            this.form = {...this.$options.defaultFormProperties };
        },
        deleteEmptyFields(object) {
            for (const key in object) {
                if (Object.hasOwnProperty.call(object, key)) {
                    const value = object[key];
                    if (
                        value === null ||
                        value === "" ||
                        (Array.isArray(value) && !value.length)
                    ) {
                        delete object[key];
                    }
                }
            }
        },
    },
    async mounted() {
        await this.setQueryFields();
        console.log(this.form);
        this.$watch(
            "form",
            () => {
                clearTimeout(this.setTimeout);
                this.setTimeout = setTimeout(() => this.onSubmit(), 500);
            }, { deep: true }
        );
    },
    beforeUnmount() {
        console.log("UNMOUNT");
        clearTimeout(this.setTimeout);
    },
};
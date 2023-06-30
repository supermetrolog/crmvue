export const TableContentMixin = {
    data() {
        return {
            mounted: false,
            loader: true,
            watcher: null
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
        this.watcher = this.$watch("$route", (newValue, oldValue) => {
            if (newValue.path == oldValue.path) {
                this.getContent();
            }
        });
        await this.getContent();
        if (!this.mounted) {
            return;
        }
    },

    beforeUnmount() {
        this.mounted = false;
        if (this.watcher != null) {
            this.watcher()
        }
    }

};

import { mapActions, mapGetters } from "vuex";
export const SearchFormMixin = {
    data() {
        return {
            setTimeout: null,
            extraVisible: false,
            form: {...this.$options.defaultFormProperties },
        };
    },
    props: {
        noUrl: {
            type: Boolean,
            default: false,
        },
        queryParams: {
            type: Object,
        }
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
            let query = {};
            if (!this.noUrl) {
                query = {...this.$route.query, ...this.form };
            } else {
                query = {...this.form };
            }
            this.deleteEmptyFields(query);

            query.page = 1;
            if (!this.noUrl) {
                this.$router.replace({ query });
            }
            this.$emit('search', query);
        },
        resetForm() {
            this.form = {...this.$options.defaultFormProperties };
            this.$emit('reset');
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

        setQueryFieldsNoUrl() {
            if (this.queryParams) {
                this.form = {...this.form, ...this.queryParams };
            }
        }
    },
    async mounted() {
        if (!this.noUrl) {
            await this.setQueryFields();
        } else {
            this.$watch(
                "queryParams",
                () => {
                    this.setQueryFieldsNoUrl();
                }, { deep: true }
            );
            this.setQueryFieldsNoUrl();
        }
        this.$watch(
            "form",
            () => {
                clearTimeout(this.setTimeout);
                this.setTimeout = setTimeout(() => this.onSubmit(), 500);
            }, { deep: true }
        );

    },
    beforeUnmount() {
        clearTimeout(this.setTimeout);
    },
};
import { deleteEmptyFields } from '@/utils/deleteEmptyFields.js';

export const TableContentMixin = {
    data() {
        return {
            mounted: false,
            loader: true,
            watcher: null
        };
    },
    methods: {
        async next(number) {
            let query = { ...this.$route.query };
            query.page = number;
            await this.$router.replace({ query });
        },
        async initialRouteSettings() {
            let query = { ...this.$route.query };
            const queryLength = Object.keys(this.$route.query).length;
            if (!queryLength) {
                query.consultant_id = this.THIS_USER.id;
            }
            await this.$router.replace({ query });
        }
    },
    async mounted() {
        await this.initialRouteSettings();
        this.mounted = true;
        this.watcher = this.$watch('$route', (newValue, oldValue) => {
            if (newValue.path === oldValue.path && newValue.fullPath !== oldValue.fullPath) {
                this.getContent();
            }
        });
        await this.getContent();
    },

    beforeUnmount() {
        this.mounted = false;
        if (this.watcher != null) {
            this.watcher();
        }
    }
};

import { mapActions, mapGetters } from 'vuex';
import { watch } from 'vue';

export const SearchFormMixin = {
    emits: ['search', 'reset'],
    data() {
        return {
            setTimeout: null,
            extraVisible: false,
            form: { ...this.$options.defaultFormProperties }
        };
    },
    props: {
        noUrl: {
            type: Boolean,
            default: false
        },
        queryParams: {
            type: Object
        }
    },
    computed: {
        ...mapGetters(['THIS_USER']),
        filterCount() {
            let count = 0;
            for (const key in this.$options.defaultFormProperties) {
                if (Object.hasOwnProperty.call(this.form, key)) {
                    const value = this.form[key];
                    if (value !== null && value !== '') {
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
        }
    },
    methods: {
        ...mapActions(['FETCH_CONSULTANT_LIST']),
        onSubmit() {
            let query = {};
            if (!this.noUrl) {
                query = { ...this.$route.query, ...this.form };
            } else {
                query = { ...this.form };
            }

            deleteEmptyFields(query);

            if (!this.noUrl) {
                this.$router.replace({ query });
            }
            this.$emit('search', query);
        },
        resetForm() {
            this.form = { ...this.$options.defaultFormProperties };
            this.$emit('reset');
        },
        setQueryFieldsNoUrl() {
            if (this.queryParams) {
                this.form = { ...this.form, ...this.queryParams };
            }
        }
    },
    async mounted() {
        if (this.noUrl) {
            watch(
                () => this.queryParams,
                () => {
                    this.setQueryFieldsNoUrl();
                },
                { deep: true }
            );
            this.setQueryFieldsNoUrl();
        } else await this.setQueryFields();

        watch(
            () => this.form,
            () => {
                clearTimeout(this.setTimeout);
                this.setTimeout = setTimeout(() => this.onSubmit(), 500);
            },
            { deep: true, immediate: this.noUrl }
        );
    },
    beforeUnmount() {
        clearTimeout(this.setTimeout);
    }
};

export const AsyncModalMixin = {
    data() {
        return {
            opened: false,
            promiseProps: null
        };
    },
    methods: {
        open(props = null) {
            let resolve, reject;
            const promise = new Promise((ok, fail) => {
                resolve = ok;
                reject = fail;
            });

            this.$options.promiseController = { resolve, reject };

            this.promiseProps = props;
            this.opened = true;

            return promise;
        },
        close() {
            this.$options.promiseController.resolve(false);
            this.opened = false;
        },
        resolve(value = true) {
            this.$options.promiseController.resolve(value);
            this.opened = false;
        }
    }
};

export const ScrollToEndMixin = {
    methods: {
        async scrollListToEnd() {
            await this.$nextTick();

            if (this.$refs.list) {
                this.$refs.list.scrollTop = this.$refs.list.scrollHeight;
            }
        }
    },
    mounted() {
        this.scrollListToEnd();
    }
};

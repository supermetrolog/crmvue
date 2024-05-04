import { alg } from '@/utils/alg';

export const DebouncedQuerySearchMixin = {
    data() {
        return {
            querySearch: null
        };
    },
    computed: {
        debouncedQuerySearch: {
            set: alg.debounce(function (value) {
                this.querySearch = value;
            }, 500),
            get() {
                return this.querySearch;
            }
        }
    }
};

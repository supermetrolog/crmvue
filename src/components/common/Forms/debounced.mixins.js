import { debounce } from '@/utils/debounce.js';

export const DebouncedQuerySearchMixin = {
    data() {
        return {
            querySearch: null
        };
    },
    computed: {
        debouncedQuerySearch: {
            set: debounce(function (value) {
                this.querySearch = value;
            }, 500),
            get() {
                return this.querySearch;
            }
        }
    }
};

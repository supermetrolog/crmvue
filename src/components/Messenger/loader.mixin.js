export const LoaderMixin = {
    data() {
        return {
            isLoading: false,
            loadingTimeout: null,
            loadingDelay: 500,
            loadingState: false
        };
    },
    computed: {
        originalLoader() {
            return this.loadingState;
        }
    },
    methods: {
        clearLoadingTimeout() {
            clearTimeout(this.loadingTimeout);
            this.loadingTimeout = null;
        },
        originalLoaderHandler() {
            this.isLoading = true;

            if (this.loadingTimeout) this.clearLoadingTimeout();

            this.loadingTimeout = setTimeout(() => {
                if (!this.originalLoader) this.isLoading = false;
                if (this.loadingTimeout) this.clearLoadingTimeout();
            }, this.loadingDelay);
        }
    },
    watch: {
        originalLoader(value) {
            if (value) {
                this.originalLoaderHandler();
            } else {
                if (!this.loadingTimeout) this.isLoading = false;
            }
        }
    },
    created() {
        if (this.originalLoader) this.originalLoaderHandler();
    }
};

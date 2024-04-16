export const LoaderMixin = {
    data() {
        return {
            isLoading: false,
            loadingTimeout: null,
            loadingDelay: 500
        };
    },
    computed: {
        originalLoader() {
            return false;
        }
    },
    methods: {
        clearLoadingTimeout() {
            clearTimeout(this.loadingTimeout);
            this.loadingTimeout = null;
        }
    },
    watch: {
        originalLoader(value) {
            if (value) {
                this.isLoading = true;

                if (this.loadingTimeout) this.clearLoadingTimeout();

                this.loadingTimeout = setTimeout(() => {
                    if (!this.originalLoader) this.isLoading = false;
                    if (this.loadingTimeout) this.clearLoadingTimeout();
                }, this.loadingDelay);
            } else {
                if (!this.loadingTimeout) this.isLoading = false;
            }
        }
    }
};

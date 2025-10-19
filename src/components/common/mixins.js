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

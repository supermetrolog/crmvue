export default {
    props: {
        disabled: {
            type: [Boolean, Number],
            default: false
        },
        reactive: {
            type: [Boolean, Number],
            default: false
        }
    },
    computed: {
        inputClasses() {
            if (this.v) {
                if (this.v.required) {
                    return {
                        invalid: this.v.$error,
                        valid: this.v.$dirty && !this.v.$error && !this.reactive
                    };
                } else {
                    if (Array.isArray(this.modelValue)) {
                        return {
                            invalid: this.v.$error,
                            valid:
                                this.v.$dirty &&
                                !this.v.$error &&
                                this.modelValue.length &&
                                !this.reactive
                        };
                    }
                    return {
                        invalid: this.v.$error,
                        valid:
                            this.v.$dirty &&
                            !this.v.$error &&
                            this.modelValue !== null &&
                            this.modelValue !== '' &&
                            !this.reactive
                    };
                }
            }
            return '';
        },
        hasValidationError() {
            return this.v && this.v.$error;
        },
        hasValidation() {
            return this.v && this.v.$dirty && (this.v.$model || this.v.$error);
        }
    },
    methods: {
        validate() {
            if (this.v) {
                this.v.$touch();
            }
        }
    }
};

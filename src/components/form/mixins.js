export default {
    computed: {
        inputClasses() {
            if (this.v) {
                if (this.v.required) {
                    return {
                        invalid: this.v.$error,
                        valid: this.v.$dirty && !this.v.$error,
                    };
                } else {
                    if (Array.isArray(this.modelValue)) {
                        return {
                            invalid: this.v.$error,
                            valid: this.v.$dirty && !this.v.$error && this.modelValue.length,
                        };
                    }
                    return {
                        invalid: this.v.$error,
                        valid: this.v.$dirty && !this.v.$error && this.modelValue !== null && this.modelValue !== "",
                    };
                }
            }
            return "";
        },
    },
    methods: {
        validate() {
            if (this.v) {
                this.v.$touch();
            }
        },
    }
}
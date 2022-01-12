export const MixinStepActions = {
    props: {
        step: {
            type: [Object, Boolean],
        },
        disabled: {
            type: Boolean,
        },
        contactForSendMessage: {
            type: Array,
        },
    },
    methods: {
        clickUpdateStep(data, flag, fn = null) {
            this.$emit("updateStep", data, flag, fn);
        },
        updatedObjects(data, fn) {
            this.$emit("updatedObjects", data, false, fn);
        },
    },
    emits: ["updateStep", "updatedObjects"],
}

export const MixinSteps = {
    data() {
        return {
            data: this.step,
        };
    },
    props: {
        step: {
            type: [Object, Boolean],
        },
        disabled: {
            type: Boolean,
        },
    },
    watch: {
        step() {
            this.data = this.step;
        },
    },
    emits: ["updateItem"],

}
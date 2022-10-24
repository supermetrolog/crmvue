import StepStage from "./steps/steps-stages/StepStage.vue";
import ButtonList from "@/components/common/ButtonList";
export const MixinStepActions = {
    components: {
        StepStage,
        ButtonList,
    },
    props: {
        step: {
            type: [Object, Boolean],
        },
        disabled: {
            type: Boolean,
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
    components: {
        StepStage,
        ButtonList,
    },
    props: {
        step: {
            type: [Object, Boolean],
        },
        disabled: {
            type: Boolean,
        },

        buttons: {
            type: Array,
        }
    },
    watch: {
        step() {
            this.data = this.step;
        },
    },
    emits: ["updateItem"],

}
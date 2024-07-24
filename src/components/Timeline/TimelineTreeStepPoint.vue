<template>
    <div class="timeline-tree-step" :class="className">
        <div class="timeline-tree-step__point" :class="{ done: done }">
            <i
                v-if="selected"
                class="fa-solid fa-circle-play timeline-tree-step__icon-selected"
            ></i>
            <i v-else-if="attention" class="fa-solid fa-circle-exclamation"></i>
            <i v-else-if="process" class="fa-solid fa-clock timeline-tree-step__icon-selected"></i>
            <i v-else-if="done" class="fa-solid fa-circle-check dashboard-cl-success"></i>
        </div>
        <i v-if="icon" class="timeline-tree-step__icon icon" :class="icon" />
        <span class="timeline-tree-step__label">{{ step.label }}</span>
    </div>
</template>

<script>
export default {
    name: 'TimelineTreeStepPoint',
    props: {
        step: {
            type: Object,
            required: true
        },
        available: {
            type: Boolean,
            default: false
        },
        selected: {
            type: Boolean,
            default: false
        },
        done: {
            type: Boolean,
            default: false
        },
        icon: {
            type: String,
            default: null
        },
        point: {
            type: Boolean,
            default: false
        },
        process: {
            type: Boolean,
            default: false
        },
        attention: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        className() {
            return {
                disabled: !this.available,
                point: this.point,
                'timeline-tree-step--available': this.available,
                'timeline-tree-step--selected': this.selected,
                'timeline-tree-step--done': this.done,
                'timeline-tree-step--in-process': this.process
            };
        }
    }
};
</script>

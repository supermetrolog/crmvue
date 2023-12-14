<template>
    <div class="accordion__item col-12" :class="{ open: isActive, disabled }">
        <div class="accordion__item__title" v-if="titleVisible">
      <span
          class="badge autosize"
          :class="titleClasses"
          @click="openAccordionItem(hash, $event)"
      >
        {{ title }}
        <i class="fas fa-angle-up" v-if="isActive && !disabled"></i>
        <i class="fas fa-angle-down" v-if="!isActive && !disabled"></i>
      </span>
        </div>
        <div class="accordion__item__body">
            <slot/>
        </div>
    </div>
</template>

<script>
import {inject, onBeforeMount, onBeforeUnmount, ref, watch} from "vue";

export default {
    name: "AccordionItem",
    data() {
        return {
            open: this.openByDefault,
        };
    },
    props: {
        title: {
            type: String,
            default: "___",
        },
        id: {
            type: Number,
        },
        titleClasses: {
            type: String,
            default: "badge-danger",
        },
        titleVisible: {
            type: Boolean,
            default: true,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    setup(props) {
        const isActive = ref(false);

        const tabsProvider = inject("tabsProvider");
        const addTab = inject("addTab");
        const updateTab = inject("updateTab");
        const deleteTab = inject("deleteTab");
        const selectTab = inject("selectTab");

        const computedId = props.id
            ? props.id
            : props.title.toLowerCase().replace(/ /g, "-");
        const hash = "#" + (!props.disabled ? computedId : "");
        watch(
            () => tabsProvider.activeTabHash,
            () => {
                isActive.value = hash === tabsProvider.activeTabHash;
            }
        );

        watch(
            () => Object.assign({}, props),
            () => {
                updateTab(computedId, {
                    title: props.title,
                    disabled: props.disabled,
                    hash: hash,
                    index: tabsProvider.tabs.length,
                    computedId: computedId,
                });
            }
        );
        onBeforeMount(() => {
            addTab({
                title: props.title,
                disabled: props.disabled,
                hash: hash,
                index: tabsProvider.tabs.length,
                computedId: computedId,
            });
        });
        onBeforeUnmount(() => {
            deleteTab(computedId);
        });
        return {
            computedId,
            hash,
            isActive,
            selectTab,
        };
    },
    methods: {
        openAccordionItem(hash, event) {
            if (this.disabled) {
                return;
            }
            this.selectTab(hash, event);
        },
    },
};
</script>

<style>
</style>


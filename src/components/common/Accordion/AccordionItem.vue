<template>
    <div class="accordion__item col-12" :class="{ open: isActive, disabled }">
        <div v-if="titleVisible" class="accordion__item__title">
            <span @click="openAccordionItem(hash, $event)" class="badge autosize" :class="titleClasses">
                {{ title }}
                <i v-if="isActive && !disabled" class="fas fa-angle-up"></i>
                <i v-if="!isActive && !disabled" class="fas fa-angle-down"></i>
            </span>
        </div>
        <div class="accordion__item__body">
            <slot />
        </div>
    </div>
</template>

<script>
import { inject, onBeforeMount, onBeforeUnmount, ref, watch } from 'vue';

export default {
    name: 'AccordionItem',
    props: {
        title: {
            type: String,
            default: '___'
        },
        id: {
            type: Number
        },
        titleClasses: {
            type: String,
            default: 'badge-danger'
        },
        titleVisible: {
            type: Boolean,
            default: true
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    setup(props) {
        const isActive = ref(false);

        const tabsProvider = inject('tabsProvider');
        const addTab = inject('addTab');
        const updateTab = inject('updateTab');
        const deleteTab = inject('deleteTab');
        const selectTab = inject('selectTab');

        const computedId = props.id ? props.id : props.title.toLowerCase().replace(/ /g, '-');
        const hash = '#' + (!props.disabled ? computedId : '');
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
                    computedId: computedId
                });
            }
        );
        onBeforeMount(() => {
            addTab({
                title: props.title,
                disabled: props.disabled,
                hash: hash,
                index: tabsProvider.tabs.length,
                computedId: computedId
            });
        });
        onBeforeUnmount(() => {
            deleteTab(computedId);
        });
        return {
            computedId,
            hash,
            isActive,
            selectTab
        };
    },
    data() {
        return {
            open: this.openByDefault
        };
    },
    methods: {
        openAccordionItem(hash, event) {
            if (this.disabled) {
                return;
            }
            this.selectTab(hash, event);
        }
    }
};
</script>

<style></style>
<template>
    <UiButton
        ref="buttonEl"
        class="user-folder"
        color="light"
        small
        :class="{ move: moveIconMustBeShown, active, edit: editIconMustBeShown }"
    >
        <template #icon>
            <i :class="icon" :style="{ color: iconColor }" />
        </template>
        <template #default>
            <span>{{ folder.name }}</span>
            <span class="ml-1 text-grey">({{ folder.entities_count ?? 0 }})</span>
        </template>
        <template #after>
            <AnimationTransition :speed="0.2">
                <div v-if="editIconMustBeShown || moveIconMustBeShown" class="user-folder__actions">
                    <UiTooltipIcon
                        v-if="editIconMustBeShown"
                        ref="editButton"
                        @click.capture.prevent.stop="$emit('edit')"
                        tooltip="Нажмите, чтобы редактировать папку"
                        icon="fa-solid fa-pen"
                        class="user-folder__edit-icon"
                    />
                    <UiTooltipIcon
                        v-if="moveIconMustBeShown"
                        tooltip="Перетащите, чтобы изменить позицию в списке"
                        icon="fa-solid fa-arrows-up-down-left-right"
                    />
                </div>
            </AnimationTransition>
        </template>
    </UiButton>
</template>
<script setup>
import UiButton from '@/components/common/UI/UiButton.vue';
import { computed, useTemplateRef, watch } from 'vue';
import { useElementHover } from '@vueuse/core';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import UiTooltipIcon from '@/components/common/UI/UiTooltipIcon.vue';

const emit = defineEmits(['enable-sort', 'disable-sort', 'edit']);
const props = defineProps({
    folder: {
        type: Object,
        required: true
    },
    editable: Boolean,
    movable: Boolean,
    dragging: Boolean,
    active: Boolean
});

const defaultIcon = 'fa-solid fa-folder';
const defaultColor = '7c7c86';

const icon = computed(() => props.folder.icon ?? defaultIcon);
const iconColor = computed(() => `#${props.folder.color ?? defaultColor}`);

const buttonEl = useTemplateRef('buttonEl');

const isHovered = useElementHover(buttonEl, { delayEnter: 1000 });
const editIsHovered = useElementHover(useTemplateRef('editButton'));

const moveIconMustBeShown = computed(() => props.movable && isHovered.value && !props.dragging);
const editIconMustBeShown = computed(() => props.editable && isHovered.value && !props.dragging);

watch(isHovered, value => {
    if (value) {
        if (props.movable && !props.dragging && !editIsHovered.value) emit('enable-sort');
    } else emit('disable-sort');
});

watch(editIsHovered, value => {
    if (moveIconMustBeShown.value) {
        if (value) emit('disable-sort');
        else emit('enable-sort');
    }
});
</script>

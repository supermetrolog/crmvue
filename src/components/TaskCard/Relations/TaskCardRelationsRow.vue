<template>
    <div class="task-card-relations-row">
        <div class="task-card-relations-row__header">
            <span>
                <span v-if="icon"><i class="mr-1" :class="icon" /></span>{{ label }} ({{
                    relations.length
                }})
            </span>
            <UiButton
                v-if="relations.length"
                @click="$emit('link')"
                class="ml-auto"
                small
                color="success-light"
                icon="fa-solid fa-plus"
                :disabled
            >
                Добавить
            </UiButton>
        </div>
        <div class="task-card-relations-row__list">
            <UiButton
                v-if="!relations.length"
                @click="$emit('link')"
                small
                color="success-light"
                icon="fa-solid fa-plus"
                :disabled
            >
                Добавить
            </UiButton>
            <div v-for="relation in relations" :key="relation.id" :class="itemClass">
                <slot name="relation" :relation="relation">
                    <UiField small color="light">
                        Связь с {{ relation.entity_type }} #{{ relation.entity_id }}
                    </UiField>
                </slot>
            </div>
        </div>
    </div>
</template>

<script setup>
import UiField from '@/components/common/UI/UiField.vue';
import UiButton from '@/components/common/UI/UiButton.vue';

defineEmits(['link']);
defineProps({
    label: {
        type: String,
        required: true
    },
    icon: String,
    relations: {
        type: Array,
        default: () => []
    },
    disabled: Boolean,
    itemClass: [String, Array, Object]
});
</script>

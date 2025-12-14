<template>
    <div class="form__group">
        <div v-if="options.length" class="list">
            <FormAttributeOptionsPreviewItem
                v-for="option in options"
                :key="option.id"
                @edit="$emit('edit', option)"
                @delete="$emit('delete', option)"
                :option="option"
            />
        </div>
        <UiButton @click.prevent="$emit('create')" icon="fa-solid fa-plus" small color="light">
            Добавить вариант
        </UiButton>
    </div>
</template>

<script setup lang="ts">
import UiButton from '@/components/common/UI/UiButton.vue';
import { AttributeOption } from '@/modules/eav/attribute-option';
import FormAttributeOptionsPreviewItem from '@/components/Forms/Attribute/FormAttributeOptionsPreviewItem.vue';

defineEmits<{
    (e: 'edit', options: AttributeOption): void;
    (e: 'delete', options: AttributeOption): void;
    (e: 'create'): void;
}>();

defineProps<{
    options: AttributeOption[];
}>();
</script>

<style scoped>
.list {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    padding: 5px 5px 5px 0;
    margin-right: -5px;
    gap: 5px;
    max-height: 350px;
    overflow-y: auto;
    margin-bottom: 10px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
</style>

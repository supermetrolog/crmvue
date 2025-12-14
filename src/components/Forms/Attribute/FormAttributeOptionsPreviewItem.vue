<template>
    <div class="option">
        <span class="label text-overflow">{{ option.label }}</span>
        <div class="d-flex align-items-center gap-1">
            <UiButtonIcon
                @click.prevent="$emit('edit')"
                color="light"
                label="Редактировать"
                icon="fa-solid fa-pen"
                small
            />
            <UiButtonIcon
                @click.prevent="$emit('delete')"
                color="light"
                label="Удалить"
                icon="fa-solid fa-trash"
                small
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import { AttributeOption } from '@/modules/eav/attribute-option';

defineEmits<{
    edit: [];
    delete: [];
}>();

defineProps<{
    option: AttributeOption;
}>();
</script>
<style scoped>
.option {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 3px;
    padding: 5px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 5px;
}
</style>

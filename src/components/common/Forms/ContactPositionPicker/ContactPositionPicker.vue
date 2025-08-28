<template>
    <MultiSelect
        ref="multiselectEl"
        v-model="positionModel"
        @change="onChangePosition"
        :label
        :options="() => filteredPositions"
        :close-on-select
        :placeholder
        :v
        :required="required && !positionUnknownModel"
        :disabled="disabled || positionUnknownModel"
        searchable
        can-deselect
        resolve-on-load
        no-results-text="Должность не найдена"
        no-options-text="Список должностей пуст"
        :delay="150"
    >
        <template #after>
            <slot name="after">
                <div class="d-flex">
                    <UiCheckbox
                        v-model="positionUnknownModel"
                        @change="onChangePositionUnknown"
                        numeric
                    >
                        Должность неизвестна
                    </UiCheckbox>
                    <UiButton
                        @click="openModal"
                        :disabled="disabled || positionUnknownModel"
                        mini
                        color="light"
                        icon="fa-solid fa-plus"
                        class="ml-auto"
                    >
                        Добавить должность
                    </UiButton>
                </div>
            </slot>
            <teleport to="body">
                <FormContactPosition
                    v-if="modalIsVisible"
                    @created="onCreated"
                    @close="modalIsVisible = false"
                />
            </teleport>
        </template>
    </MultiSelect>
</template>
<script setup lang="ts">
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import UiCheckbox from '@/components/common/Forms/UiCheckbox.vue';
import { computed, nextTick, ref, useTemplateRef } from 'vue';
import { useContactPositionShared } from '@/composables/useContactPosition.js';
import { BooleanNumber } from '@/types/base';
import UiButton from '@/components/common/UI/UiButton.vue';
import FormContactPosition from '@/components/Forms/FormContactPosition.vue';
import { ContactPosition } from '@/types/contact/contact';
import { isNullish } from '@/utils/helpers/common/isNullish';

const positionModel = defineModel<number>();
const positionUnknownModel = defineModel<BooleanNumber>('unknown');

const emit = defineEmits<{ (e: 'change', value: number | null): void }>();

withDefaults(
    defineProps<{
        closeOnSelect?: boolean;
        placeholder?: string;
        label?: string;
        required?: boolean;
        disabled?: boolean;
        v?: object;
    }>(),
    { label: 'Должность', placeholder: 'Выберите должность..', closeOnSelect: true }
);

const { positions, load, addPosition } = useContactPositionShared();

const filteredPositions = computed(() => {
    return positions.value
        .filter(
            position =>
                (isNullish(position.deleted_at) && position.is_active) ||
                positionModel.value === position.id
        )
        .map(position => ({
            value: position.id,
            label: position.name,
            description: position.description
        }));
});

function onChangePositionUnknown() {
    if (positionUnknownModel.value) {
        positionModel.value = null;
    }
}

function onChangePosition() {
    if (positionModel.value) {
        positionUnknownModel.value = null;
    }

    emit('change', positionModel.value);
}

// modal

const modalIsVisible = ref(false);
const multiselectEl = useTemplateRef('multiselectEl');

function openModal() {
    modalIsVisible.value = true;

    multiselectEl.value.close();
}

function onCreated(position: ContactPosition) {
    modalIsVisible.value = false;

    addPosition(position);

    nextTick(() => {
        multiselectEl.value?.refreshOptions(() => {
            positionModel.value = position.id;
        });
    });
}
</script>

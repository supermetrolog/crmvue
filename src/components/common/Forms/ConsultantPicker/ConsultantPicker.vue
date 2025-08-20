<template>
    <MultiSelect
        ref="multiselectEl"
        v-model="modelValue"
        :label="label"
        :v
        searchable
        can-deselect
        resolve-on-load
        :delay="500"
        :options="getOptions"
        :close-on-select="closeOnSelect"
        :placeholder="placeholder"
        :multiple-label="multipleLabelFn"
    >
        <template #option="{ option }">
            <ConsultantPickerOptionComp :option="option" :show-role="!showOnlyConsultants" />
        </template>
        <template #singlelabel="{ value }">
            <ConsultantPickerOptionComp
                class="custom"
                :option="value"
                :show-role="!showOnlyConsultants"
            />
        </template>
        <template #chip="{ option, removeByIndex, index }">
            <ConsultantPickerOptionChip @remove="removeByIndex(index)" :option="option" />
        </template>
        <template v-if="$slots.after" #after>
            <slot name="after" />
        </template>
        <template #beforelist>
            <div class="before-list">
                <UiCheckbox v-model="showOnlyConsultants" label="Показывать только брокеров" />
            </div>
        </template>
    </MultiSelect>
</template>
<script setup lang="ts">
import MultiSelect, {
    MultiSelectOption,
    MultiSelectOptions
} from '@/components/common/Forms/MultiSelect.vue';
import ConsultantPickerOptionComp from '@/components/common/Forms/ConsultantPicker/ConsultantPickerOption.vue';
import ConsultantPickerOptionChip from '@/components/common/Forms/ConsultantPicker/ConsultantPickerOptionChip.vue';
import { plural } from '@/utils/plural.js';
import { UserRoleEnum } from '@/types/user';
import { useTemplateRef, watch } from 'vue';
import UiCheckbox from '@/components/common/Forms/UiCheckbox.vue';
import { useCachedRef } from '@/composables/useCachedRef';

const modelValue = defineModel<number>();

export interface ConsultantPickerExtraOption {
    id: number;
    status: number;
    avatar: string | null;
    short_name: number;
    role_id: number;
    role: string;
    email: string | null;
    phones: string | null;
    emails: string | null;
    user_id_old: number | null;
}

export type ConsultantPickerOption = MultiSelectOption<string, number, ConsultantPickerExtraOption>;

export type ConsultantPickerOptions = MultiSelectOptions<ConsultantPickerOption>;

const props = withDefaults(
    defineProps<{
        closeOnSelect?: boolean;
        placeholder?: string;
        label?: string;
        options: ConsultantPickerOptions;
        v?: object;
    }>(),
    {
        closeOnSelect: true,
        placeholder: 'Выберите консультанта..',
        label: 'Консультант'
    }
);

const multipleLabelFn = elements => {
    return plural(
        elements.length,
        'Выбран %d сотрудник',
        'Выбраны %d сотрудника',
        'Выбрано %d сотрудников'
    );
};

const availableConsultantRoles = new Set([
    UserRoleEnum.CONSULTANT,
    UserRoleEnum.SYSTEM,
    UserRoleEnum.OWNER
]);

async function getOptions() {
    let opts = props.options;

    if (typeof props.options === 'function') {
        opts = (await props.options()) as ConsultantPickerOption[];
    }

    return showOnlyConsultants.value ? getOnlyConsultants(opts) : opts;
}

function getOnlyConsultants(opts: ConsultantPickerOption[]) {
    return opts.filter(
        consultant =>
            consultant.id === modelValue.value || availableConsultantRoles.has(consultant.role_id)
    );
}

const showOnlyConsultants = useCachedRef('ui:show-only-consultants', true);

const multiselectEl = useTemplateRef('multiselectEl');

watch(showOnlyConsultants, () => {
    multiselectEl.value.refreshOptions();
});
</script>
<style scoped>
.before-list {
    padding: 5px 0.5rem 1px 0.5rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    opacity: 0.2;
    transition: opacity 0.3s;
}

.before-list:hover {
    opacity: 1;
}
</style>

<template>
    <MultiSelect
        ref="multiselect"
        v-model="model"
        extra-classes="long-text"
        :label
        :filterResults="false"
        :min-chars="1"
        :resolve-on-load
        :delay
        :options="fetcher"
        :groups="!searchOnlyInRussia"
        :required
        :disabled
        :v
        :placeholder
        searchable
    >
        <template #option="{ option, isSelected }">
            <div class="d-flex flex-column">
                <p>{{ option.label }}</p>
                <p
                    v-if="option.description"
                    class="fs-2"
                    :class="{ 'text-grey': !isSelected(option) }"
                >
                    {{ option.description }}
                </p>
            </div>
        </template>
        <template #singlelabel="{ value }">
            {{ value.value ?? value.description }}
        </template>
        <template #after>
            <UiCheckbox v-model="searchOnlyInRussia" numeric label="Искать только в России" />
        </template>
    </MultiSelect>
</template>
<script setup lang="ts">
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import UiCheckbox from '@/components/common/Forms/UiCheckbox.vue';
import { useCachedRef } from '@/composables/useCachedRef';
import { AddressSuggestion, findAddressByText } from '@/services/map/geocode';
import { useTemplateRef, watch } from 'vue';

const model = defineModel<string>();

const props = withDefaults(
    defineProps<{
        label?: string;
        resolveOnLoad?: boolean;
        delay?: number;
        currentValue?: string | null;
        placeholder?: string;
        required?: boolean;
        disabled?: boolean;
        v?: object;
    }>(),
    {
        label: 'Адрес',
        delay: 600,
        placeholder: 'Введите адрес..'
    }
);

const searchOnlyInRussia = useCachedRef('ui:search-address:only-russia', 1);

const multiselectEl = useTemplateRef('multiselect');

watch(searchOnlyInRussia, () => {
    multiselectEl.value?.refreshOptions();
});

type CurrentAddressSuggestion = { value: string; label: string };

function isFullAddressSuggestion(
    suggestion: AddressSuggestion | CurrentAddressSuggestion
): suggestion is AddressSuggestion {
    return 'components' in suggestion;
}

type MultiSelectGroup = {
    label: string;
    options: (AddressSuggestion | CurrentAddressSuggestion)[];
};

async function fetcher(query?: string) {
    const preparedQuery = searchOnlyInRussia.value && query?.length ? `россия ${query}` : query;

    const response = await findAddressByText(preparedQuery);

    let options = [...response] as (AddressSuggestion | CurrentAddressSuggestion)[];

    if (props.currentValue && !options.some(option => option.value === props.currentValue)) {
        options.push({
            label: props.currentValue,
            value: props.currentValue
        });
    }

    if (!searchOnlyInRussia.value) {
        const groups = [] as MultiSelectGroup[];

        for (const option of options) {
            if (isFullAddressSuggestion(option)) {
                const country = option.components.find(component => component.kind === 'country');

                if (country) {
                    const group = groups.find(g => g.label === country.name);

                    if (group) {
                        group.options.push(option);
                    } else {
                        groups.push({
                            label: country.name,
                            options: [option]
                        });
                    }
                }
            } else {
                groups.push({
                    label: 'Текущий адрес',
                    options: [option]
                });
            }
        }

        return groups;
    }

    return options;
}
</script>

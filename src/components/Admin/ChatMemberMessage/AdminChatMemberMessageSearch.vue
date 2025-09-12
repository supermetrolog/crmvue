<template>
    <UiForm>
        <UiFormGroup>
            <div class="col-12">
                <div class="d-flex align-items-end flex-column flex-md-row">
                    <UiInput
                        v-model="form.search"
                        label="Поиск"
                        placeholder="Сообщение"
                        class="w-100"
                    />
                    <div class="ml-md-2 mt-2 mt-md-0 d-flex gap-2 w-100">
                        <UiButton
                            @click="filtersIsVisible = true"
                            icon="fa-solid fa-sliders"
                            color="light"
                        >
                            Фильтры
                        </UiButton>
                        <UiButton
                            @click="resetForm"
                            :disabled="filtersCount === 0"
                            color="danger-light"
                            icon="fa-solid fa-trash"
                        >
                            Очистить
                        </UiButton>
                    </div>
                </div>
            </div>
        </UiFormGroup>
    </UiForm>
    <div class="d-flex gap-2 flex-wrap mt-2">
        <Chip
            v-for="item in humanizedSelectedFilters"
            :key="item.value"
            @delete="removeFilter(item.value)"
            :value="item.value"
            :html="item.label"
        />
    </div>
    <teleport to="body">
        <UiModal v-model:visible="filtersIsVisible" :width="900" title="Фильтры по сообщениям">
            <UiForm>
                <UiFormGroup class="mb-4">
                    <ConsultantPicker
                        v-model="form.from_user_id"
                        class="col-6"
                        label="Консультант"
                        :options="getConsultantsOptions"
                    >
                        <template #after>
                            <UiButton
                                @click.prevent="assignToSelf"
                                :disabled="assignedToSelf"
                                small
                                color="light"
                                icon="fa-solid fa-user-astronaut"
                            >
                                Указать себя
                            </UiButton>
                        </template>
                    </ConsultantPicker>
                </UiFormGroup>
                <UiFormDivider />
                <UiFormGroup>
                    <UiCheckbox
                        v-model="form.is_pinned"
                        :true-value="1"
                        :false-value="null"
                        class="col-12"
                    >
                        Закрепленные в чате
                    </UiCheckbox>
                </UiFormGroup>
            </UiForm>
            <template #actions="{ close }">
                <UiButton
                    @click="close"
                    :disabled="!filtersCount"
                    color="danger"
                    icon="fa-solid fa-trash"
                >
                    Очистить
                </UiButton>
                <UiButton @click="close" color="light" icon="fa-solid fa-ban">Закрыть</UiButton>
            </template>
        </UiModal>
    </teleport>
</template>

<script setup>
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import { computed, ref, watch } from 'vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiInput from '@/components/common/Forms/UiInput.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import ConsultantPicker from '@/components/common/Forms/ConsultantPicker/ConsultantPicker.vue';
import { useConsultantsOptions } from '@/composables/options/useConsultantsOptions.js';
import Chip from '@/components/common/Chip.vue';
import { deleteEmptyFields } from '@/utils/helpers/object/deleteEmptyFields.js';
import { useRoute, useRouter } from 'vue-router';
import { useSearchForm } from '@/composables/useSearchForm.js';
import { cloneObject } from '@/utils/helpers/object/cloneObject.js';
import { useAuth } from '@/composables/useAuth';
import UiFormDivider from '@/components/common/Forms/UiFormDivider.vue';
import { useSelectedFilters } from '@/composables/useSelectedFilters.js';
import UiCheckbox from '@/components/common/Forms/UiCheckbox.vue';

const emit = defineEmits(['search']);

const router = useRouter();
const route = useRoute();

// form

const formTemplate = {
    search: null,
    from_user_id: null,
    is_pinned: null
};

async function setQueryFields() {
    Object.assign(form, route.query);

    let query = { ...form };
    deleteEmptyFields(query);

    await router.replace({ query });
}

function onSubmit(query) {
    emit('search', query);
}

function removeFilter(key) {
    form[key] = cloneObject(formTemplate[key]);
}

// filters

const filtersIsVisible = ref(false);

const { getConsultantsOptions, consultantsOptions } = useConsultantsOptions();
const { currentUserId } = useAuth();

function assignToSelf() {
    form.user_id = currentUserId.value;
}

const assignedToSelf = computed(() => form.user_id === currentUserId.value);

// form

const { resetForm, form } = useSearchForm(formTemplate, {
    submit: onSubmit,
    syncWithQuery: true,
    setQuery: setQueryFields
});

watch(
    () => form.search,
    () => {
        router.replace({ query: { ...route.query, page: 1 } });
    }
);

watch(
    () => route?.query?.page,
    () => {
        emit('search');
    }
);

const { filtersCount, humanizedSelectedFilters } = useSelectedFilters(
    form,
    {
        from_user_id: value => {
            if (consultantsOptions.value.length)
                return consultantsOptions.value.find(
                    element => Number(element.value) === Number(value)
                )?.label;
            return null;
        }
    },
    { ignore: new Set(['sort']) }
);
</script>

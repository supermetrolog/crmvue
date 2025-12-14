<template>
    <div>
        <p class="form__label mb-2">
            <span>Опции для выбора</span>
            <span v-if="!isLoading"> ({{ options.length }})</span>:
        </p>
        <Loader v-if="isLoading" small />
        <FormAttributeOptionsPreview
            @create="formIsVisible = true"
            @edit="edit"
            @delete="deleteOption"
            :options
        />
        <teleport to="body">
            <FormAttributeOption
                v-if="isEditMode && formIsVisible"
                @close="closeForm"
                @created="onCreated"
                @updated="onUpdated"
                @deleted="onDeleted"
                :form-data="editingOption"
                :attribute-id="attribute!.id"
            />
            <FormNewAttributeOption
                v-else-if="formIsVisible"
                @close="closeForm"
                @created="onNewCreated"
                @updated="onNewUpdated"
                @delete="deleteNew"
                :form-data="editingNewOption"
            />
        </teleport>
    </div>
</template>

<script setup lang="ts">
import Loader from '@/components/common/Loader.vue';
import { computed, ref, watch } from 'vue';
import api from '@/api/api.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';
import { captureException } from '@sentry/vue';
import { Attribute } from '@/modules/eav/attribute';
import { AttributeOption } from '@/modules/eav/attribute-option';
import FormAttributeOptionsPreview from '@/components/Forms/Attribute/FormAttributeOptionsPreview.vue';
import FormAttributeOption from '@/components/Forms/Attribute/FormAttributeOption.vue';
import FormNewAttributeOption from '@/components/Forms/Attribute/FormNewAttributeOption.vue';
import { useAsync } from '@/composables/useAsync';
import { useNotify } from '@/utils/use/useNotify';

const options = defineModel<AttributeOption[]>('options', { default: () => [] });

const props = defineProps<{ attribute?: Attribute | null }>();

const isEditMode = computed(() => isNotNullish(props.attribute));

const isLoading = ref(false);

// phones

watch(
    () => props.attribute,
    value => {
        if (value) {
            fetchOptions();
        }
    },
    { immediate: true }
);

async function fetchOptions() {
    if (!props.attribute) {
        return;
    }

    try {
        isLoading.value = true;

        options.value = await api.attribute.options(props.attribute.id);
    } catch (error) {
        captureException(error);
    } finally {
        isLoading.value = false;
    }
}

// phones form

const formIsVisible = ref(false);
const editingOption = ref<AttributeOption | null>(null);
const editingNewOption = ref<AttributeOption | null>(null);

function closeForm() {
    formIsVisible.value = false;

    editingOption.value = null;
    editingNewOption.value = null;
}

function onCreated(option: AttributeOption) {
    options.value = [...options.value!, option];

    closeForm();
    fetchOptions();
}

function onUpdated(option: AttributeOption) {
    options.value = options.value!.map(element => {
        if (element.id === option.id) {
            return {
                ...element,
                ...option
            };
        }

        return element;
    });

    closeForm();
    fetchOptions();
}

function onDeleted(option: AttributeOption) {
    closeForm();

    options.value = options.value!.filter(element => element.id !== option.id);

    fetchOptions();
}

// new phones

function deleteNew(option: AttributeOption) {
    closeForm();

    options.value = options.value!.filter(element => element.id !== option.id);
}

function onNewCreated(option: AttributeOption) {
    options.value = [...options.value!, option];
    formIsVisible.value = false;
}

function onNewUpdated(id: number, option: AttributeOption) {
    console.log(id);
    options.value = options.value!.map(element => {
        if (element.id === id) {
            return {
                ...element,
                ...option
            };
        }

        return element;
    });

    closeForm();
}

function edit(option: AttributeOption) {
    if (isEditMode.value) {
        editingOption.value = option;
    } else {
        editingNewOption.value = option;
    }

    formIsVisible.value = true;
}

async function deleteOption(option: AttributeOption) {
    if (isEditMode.value) {
        await executeDeleteOption(option.id);
    } else {
        deleteNew(option);
    }
}

const notify = useNotify();

const { execute: executeDeleteOption } = useAsync(api.attributeOption.delete, {
    onFetchResponse: () => {
        notify.success('Вариант успешно удален.');
        fetchOptions();
    },
    confirmation: true,
    confirmationContent: {
        title: 'Удалить вариант',
        message: 'Вы уверены, что хотите удалить вариант?',
        okButton: 'Удалить',
        okIcon: 'fa-solid fa-trash'
    }
});
</script>

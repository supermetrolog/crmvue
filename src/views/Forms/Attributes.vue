<template>
    <section class="attributes">
        <div class="container-fluid">
            <div class="row">
                <UiCol :cols="12">
                    <div class="white-block mb-3">
                        <div class="row align-items-center">
                            <PaginationClassic
                                ref="firstPagination"
                                @next="setNextPage"
                                :pagination="pagination"
                                class="col-xxl-6 col-lg-8 col-2"
                                :loading="isLoading"
                            />
                            <UiCol :cols="10" :lg="4" :xxl="6">
                                <UiButton
                                    @click="createAttribute"
                                    small
                                    icon="fa-solid fa-plus"
                                    color="light"
                                    class="ml-auto"
                                >
                                    Добавить атрибут
                                </UiButton>
                            </UiCol>
                        </div>
                    </div>
                </UiCol>
                <AnimationTransition :speed="0.5">
                    <UiCol v-if="filtersCount" :cols="12">
                        <div class="d-flex gap-1 flex-wrap align-items-center">
                            <Chip
                                v-for="item in humanizedSelectedFilters"
                                :key="item.value"
                                @delete="resetFilter(item.value)"
                                :value="item.value"
                                :html="item.label"
                            />
                            <span class="text-grey">|</span>
                            <UiButton
                                @click="resetFilters"
                                color="danger-light"
                                icon="fa-solid fa-trash"
                                tooltip="Нажмите, чтобы очистить фильтры"
                                small
                            >
                                Очистить
                            </UiButton>
                        </div>
                    </UiCol>
                </AnimationTransition>
                <UiCol :cols="12">
                    <ElTable
                        ref="table"
                        @filter-change="onFilterChange"
                        :data="attributes"
                        border
                        class="attribute-table"
                    >
                        <ElTableColumn prop="id" label="ID" />
                        <ElTableColumn prop="label" label="Название" />
                        <ElTableColumn prop="description" label="Описание" />
                        <ElTableColumn
                            prop="value_type"
                            label="Тип данных"
                            column-key="value_types"
                            :filters="valueTypeFilters"
                        />
                        <ElTableColumn
                            prop="input_type"
                            label="Тип поля"
                            column-key="input_types"
                            :filters="inputTypeFilters"
                        />
                        <ElTableColumn v-slot="{ row }" prop="created_by" label="Автор">
                            <Avatar
                                v-if="row.created_by"
                                :src="row.created_by.userProfile.avatar"
                                :label="row.created_by.userProfile.medium_name"
                                :size="40"
                            />
                            <span v-else class="op-5">-</span>
                        </ElTableColumn>
                        <ElTableColumn prop="created_at" label="Дата создания" />
                        <ElTableColumn label="Действия">
                            <template #default="{ row }">
                                <div class="d-flex gap-1 flex-wrap">
                                    <UiButton
                                        @click="editAttribute(row)"
                                        small
                                        color="light"
                                        icon="fa-solid fa-pen"
                                    >
                                        Редактировать
                                    </UiButton>
                                    <UiButton
                                        v-if="!row.deleted_at"
                                        @click="deleteAttribute(row.id)"
                                        small
                                        color="light"
                                        icon="fa-solid fa-trash"
                                    >
                                        Удалить
                                    </UiButton>
                                </div>
                            </template>
                        </ElTableColumn>
                        <template #append>
                            <Loader v-if="isDeleting || isLoading" small />
                        </template>
                    </ElTable>
                </UiCol>
            </div>
        </div>
        <teleport to="body">
            <FormAttribute
                v-if="formIsVisible"
                @updated="onUpdated"
                @created="onCreated"
                @deleted="onDeleted"
                @close="closeForm"
                :form-data="editingAttribute"
            />
        </teleport>
    </section>
</template>

<script setup lang="ts">
import UiCol from '@/components/common/UI/UiCol.vue';
import Loader from '@/components/common/Loader.vue';
import { ElTable, ElTableColumn } from 'element-plus';
import PaginationClassic from '@/components/common/Pagination/PaginationClassic.vue';
import { onBeforeMount, reactive, ref, shallowRef, useTemplateRef, watch } from 'vue';
import api from '@/api/api.js';
import { useDebounceFn, useTimeoutFn } from '@vueuse/core';
import { useNotify } from '@/utils/use/useNotify.js';
import { useAsync } from '@/composables/useAsync.js';
import UiButton from '@/components/common/UI/UiButton.vue';
import FormAttribute from '@/components/Forms/FormAttribute.vue';
import {
    Attribute,
    AttributeInputTypeOptions,
    AttributeValueTypeOptions
} from '@/modules/eav/attribute';
import { useSelectedFilters } from '@/composables/useSelectedFilters';
import { PaginationConfig } from '@/api/helpers/responseToPaginatedData';
import Chip from '@/components/common/Chip.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import Avatar from '@/components/common/Avatar.vue';

const isLoading = ref(false);

const attributes = ref<Attribute[]>([]);
const pagination = ref<PaginationConfig | null>(null);

async function fetchAttributes() {
    isLoading.value = true;

    const response = await api.attribute.search(filters);

    if (response) {
        attributes.value = response.data;
        pagination.value = response.pagination;
    }

    isLoading.value = false;
}

onBeforeMount(fetchAttributes);

const debouncedFetchMessages = useDebounceFn(fetchAttributes, 200);

// filters

const table = useTemplateRef('table');

const filters = reactive({
    input_types: null,
    value_types: null,
    search: null
});

const valueTypeFilters = Object.entries(AttributeValueTypeOptions).map(([value, text]) => ({
    text,
    value
}));

const inputTypeFilters = Object.entries(AttributeInputTypeOptions).map(([value, text]) => ({
    text,
    value
}));

function onFilterChange(newFilters: Record<string, (string | number)[]>) {
    Object.keys(newFilters).map(key => {
        filters[key] = newFilters[key];
    });
}

const { filtersCount, humanizedSelectedFilters } = useSelectedFilters(filters);

function resetFilter(key: string) {
    table.value!.clearFilter(key);
    filters[key] = null;
}

function resetFilters() {
    table.value!.clearFilter();
    filters.input_types = null;
    filters.value_types = null;
}

watch(filters, debouncedFetchMessages);

function setNextPage() {}

// actions

const notify = useNotify();

const editingAttribute = shallowRef<Attribute | null>(null);

const formIsVisible = ref(false);

function closeForm() {
    formIsVisible.value = false;
    editingAttribute.value = null;
}

function onCreated(attribute: Attribute) {
    closeForm();

    attributes.value.unshift(attribute);
}

function onUpdated(attribute: Attribute) {
    closeForm();

    const index = attributes.value.findIndex(attr => attr.id === attribute.id);
    if (index === -1) return;

    attributes.value[index] = attribute;
}

function onDeleted(attribute: Attribute) {
    closeForm();

    const index = attributes.value.findIndex(attr => attr.id === attribute.id);
    if (index === -1) return;

    fetchAttributes();
}

function editAttribute(attribute: Attribute) {
    editingAttribute.value = attribute;
    formIsVisible.value = true;
}

function createAttribute() {
    formIsVisible.value = true;
}

const { isLoading: isDeleting, execute: deleteAttribute } = useAsync(api.attribute.delete, {
    onFetchResponse: ({ args }) => {
        notify.success('Атрибут успешно удален.');

        const index = attributes.value.findIndex(attribute => attribute.id === args[0]);
        if (index === -1) return;

        attributes.value[index].isDeleting = true;

        useTimeoutFn(() => {
            const index = attributes.value.findIndex(attribute => attribute.id === args[0]);
            if (index !== -1) {
                attributes.value.splice(index, 1);
            }
        }, 500);
    },
    confirmation: true,
    confirmationContent: {
        title: 'Удалить атрибут',
        message: 'Вы уверены, что хотите удалить атрибут?',
        okButton: 'Удалить',
        okIcon: 'fa-solid fa-trash'
    }
});
</script>

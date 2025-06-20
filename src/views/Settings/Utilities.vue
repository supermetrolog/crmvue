<template>
    <div class="container-fluid">
        <div class="row">
            <UiCol :cols="12">
                <DashboardCard title="Инструменты модератора">
                    <div class="row">
                        <UiCol :cols="4">
                            <DashboardCard>
                                <p class="mb-1 font-weight-semi">Исправить назначения участка</p>
                                <p class="text-grey">Описание:</p>
                                <p>
                                    Инструмент для исправления объектов, у которых не отображается
                                    выбор назначения.
                                </p>
                                <UiButton
                                    @click="purposesFixFormIsVisible = true"
                                    small
                                    class="mt-2"
                                    color="light"
                                >
                                    Использовать
                                </UiButton>
                            </DashboardCard>
                        </UiCol>
                    </div>
                </DashboardCard>
            </UiCol>
        </div>
        <Teleport to="body">
            <UiModal
                v-model:visible="purposesFixFormIsVisible"
                @closed="clearPurposesFixForm"
                :width="600"
                title="Исправить назначения участка"
            >
                <MultiSelect
                    v-model="purposesFixForm.object_id"
                    @change="onChange"
                    :disabled="purposesFixIsRunning"
                    label="ID объекта"
                    searchable
                    resolve-on-load
                    :delay="500"
                    :options="getObjectsOptions"
                    placeholder="ID объекта, адрес.."
                    :filter-results="false"
                    :min-chars="1"
                >
                    <template #option="{ option, isSelected }">
                        <div class="d-flex gap-2">
                            <LazyImage
                                :src="option.thumb"
                                style="height: 50px; min-width: 90px; max-width: 90px"
                            />
                            <div>
                                <p>
                                    Объект #{{ option.value }},
                                    <span :class="{ 'text-grey': !isSelected }">
                                        {{ option.is_land ? 'участок' : 'строение' }}
                                    </span>
                                </p>
                                <p class="fs-2" :class="{ 'text-grey': !isSelected }">
                                    {{ option.address }}
                                </p>
                                <p class="fs-2" :class="{ 'text-primary': !isSelected }">
                                    Назначения: {{ option.purposes ?? '-' }}
                                </p>
                            </div>
                        </div>
                    </template>
                    <template #singlelabel="{ value: option }">
                        <div>
                            <p>
                                Объект #{{ option.value }},
                                <span class="text-grey">
                                    {{ option.is_land ? 'участок' : 'строение' }}
                                </span>
                            </p>
                            <p class="text-grey fs-2">{{ option.address }}</p>
                        </div>
                    </template>
                </MultiSelect>
                <div class="mt-2">
                    <p class="font-weight-semi">Назначения:</p>
                    <ObjectTypePicker
                        v-model:value="purposesFixForm.purposes"
                        :options="objectPurposesWithSectionsOptions.plot"
                    />
                </div>
                <div class="d-flex mt-2 gap-2">
                    <UiButton @click="selectAll" icon="fa-solid fa-check" color="light" small>
                        Выбрать все
                    </UiButton>
                    <UiButton
                        @click="clearAll"
                        icon="fa-solid fa-xmark"
                        color="light"
                        small
                        :disabled="!purposesFixForm.purposes.length"
                    >
                        Сбросить
                    </UiButton>
                </div>
                <template #actions="{ close }">
                    <UiButton
                        @click="runPurposesFix"
                        :disabled="!canBeFixed"
                        :loading="purposesFixIsRunning"
                        icon="fa-solid fa-check"
                        color="success-light"
                    >
                        Выполнить
                    </UiButton>
                    <UiButton
                        @click="close"
                        :disabled="purposesFixIsRunning"
                        icon="fa-solid fa-ban"
                        color="light"
                    >
                        Отмена
                    </UiButton>
                </template>
            </UiModal>
        </Teleport>
    </div>
</template>
<script setup>
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';
import { computed, reactive, ref, shallowRef, toRaw } from 'vue';
import api from '@/api/api.js';
import { useNotify } from '@/utils/use/useNotify.js';
import { useConfirm } from '@/composables/useConfirm.js';
import UiCol from '@/components/common/UI/UiCol.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import LazyImage from '@/components/common/LazyImage.vue';
import ObjectTypePicker from '@/components/common/Forms/ObjectTypePicker.vue';
import { objectPurposesWithSectionsOptions } from '@/const/options/object.options.js';
import { isNullish } from '@/utils/helpers/common/isNullish.ts';

const notify = useNotify();
const { confirm } = useConfirm();

const purposesFixFormIsVisible = ref(false);

const purposesFixIsRunning = ref(false);
const purposesFixForm = reactive({
    object_id: null,
    purposes: []
});

const selectedObject = shallowRef(null);

function onChange(_, option) {
    selectedObject.value = option;
}

const canBeFixed = computed(() => {
    if (isNullish(purposesFixForm.object_id)) return false;
    if (isNullish(selectedObject.value)) return false;
    if (purposesFixForm.purposes.length === 0) return false;

    return selectedObject.value.purposes.length === 0;
});

async function getObjectsOptions(querySearch) {
    let query = {
        expand: null,
        is_land: 1
    };

    if (querySearch == null) {
        return [];
    } else {
        query.search = querySearch;
    }

    const response = await api.object.list(query);

    return response.data.map(element => ({
        value: element.id,
        address: element.address,
        thumb: element.thumb,
        purposes: element.purposes,
        is_land: element.is_land
    }));
}

function clearPurposesFixForm() {
    purposesFixForm.object_id = null;
    purposesFixForm.purposes = [];
    selectedObject.value = null;
}

async function runPurposesFix() {
    const confirmed = await confirm(
        'Исправить назначения',
        'Вы действительно хотите исправить назначения?'
    );
    if (!confirmed) return;

    purposesFixIsRunning.value = true;

    try {
        await api.object.fixLandPurposes(toRaw(purposesFixForm));
        notify.success('Назначения исправлены');
    } finally {
        purposesFixIsRunning.value = false;
    }
}

// purposes

function selectAll() {
    purposesFixForm.purposes = Object.keys(objectPurposesWithSectionsOptions.plot);
}

function clearAll() {
    purposesFixForm.purposes = [];
}
</script>

<template>
    <div class="container-fluid">
        <Teleport to="body">
            <UiModal
                v-model:visible="purposesFixFormIsVisible"
                @closed="clearPurposesFixForm"
                :width="600"
                title="Object Land Purposes Fix"
            >
                <MultiSelect
                    v-model="purposesFixForm.object_id"
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
                                        {{ option.is_land ? 'участок' : 'строение' }}</span
                                    >
                                </p>
                                <p class="fs-2" :class="{ 'text-grey': !isSelected }">
                                    {{ option.address }}
                                </p>
                                <p class="fs-2" :class="{ 'text-primary': !isSelected }">
                                    purposes: {{ option.purposes ?? '-' }}
                                </p>
                            </div>
                        </div>
                    </template>
                    <template #singlelabel="{ value: option }">
                        <div>
                            <p>
                                Объект #{{ option.value }},
                                <span class="text-grey">
                                    {{ option.is_land ? 'участок' : 'строение' }}</span
                                >
                            </p>
                            <p class="text-grey fs-2">{{ option.address }}</p>
                        </div>
                    </template>
                </MultiSelect>
                <template #actions="{ close }">
                    <UiButton
                        @click="runPurposesFix"
                        :disabled="!purposesFixForm.object_id"
                        :loading="purposesFixIsRunning"
                        color="success"
                    >
                        Выполнить
                    </UiButton>
                    <UiButton @click="close" :disabled="purposesFixIsRunning" color="danger">
                        Отмена
                    </UiButton>
                </template>
            </UiModal>
        </Teleport>
        <div class="row">
            <div class="col-12">
                <DashboardCard title="Инструменты администратора">
                    <div class="row">
                        <UiCol cols="3">
                            <DashboardCard>
                                <p class="mb-1">Object Land Purposes Fix</p>
                                <p class="text-grey">Описание:</p>
                                <p>Исправить назначения объекта (участка)</p>
                                <UiButton
                                    @click="purposesFixFormIsVisible = true"
                                    small
                                    class="mt-2"
                                >
                                    Использовать
                                </UiButton>
                            </DashboardCard>
                        </UiCol>
                    </div>
                </DashboardCard>
            </div>
        </div>
    </div>
</template>
<script setup>
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';
import { reactive, ref, toRaw } from 'vue';
import api from '@/api/api.js';
import { useNotify } from '@/utils/use/useNotify.js';
import { useConfirm } from '@/composables/useConfirm.js';
import UiCol from '@/components/common/UI/UiCol.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import LazyImage from '@/components/common/LazyImage.vue';

const notify = useNotify();
const { confirm } = useConfirm();

const purposesFixFormIsVisible = ref(false);

const purposesFixIsRunning = ref(false);
const purposesFixForm = reactive({
    object_id: null
});

async function getObjectsOptions(querySearch) {
    let query = {
        expand: null
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
</script>

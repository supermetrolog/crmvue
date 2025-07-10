<template>
    <UiModal
        @close="$emit('close')"
        :width="600"
        show
        custom-close
        title="Исправить назначения участка"
    >
        <MultiSelect
            v-model="form.object_id"
            @change="onChangeObjectId"
            :disabled="isRunning"
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
                v-model:value="form.purposes"
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
                :disabled="!form.purposes.length"
            >
                Сбросить
            </UiButton>
        </div>
        <template #actions="{ close }">
            <UiButton
                @click="run"
                :disabled="!canBeFixed"
                :loading="isRunning"
                icon="fa-solid fa-check"
                color="success-light"
            >
                Выполнить
            </UiButton>
            <UiButton @click="close" :disabled="isRunning" icon="fa-solid fa-ban" color="light">
                Отмена
            </UiButton>
        </template>
    </UiModal>
</template>

<script setup>
import { objectPurposesWithSectionsOptions } from '@/const/options/object.options.js';
import UiButton from '@/components/common/UI/UiButton.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import ObjectTypePicker from '@/components/common/Forms/ObjectTypePicker.vue';
import LazyImage from '@/components/common/LazyImage.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import { useNotify } from '@/utils/use/useNotify.js';
import { useConfirm } from '@/composables/useConfirm.js';
import { computed, reactive, ref, shallowRef, toRaw } from 'vue';
import { isNullish } from '@/utils/helpers/common/isNullish';
import api from '@/api/api.js';

const notify = useNotify();
const { confirm } = useConfirm();

const isRunning = ref(false);
const form = reactive({
    object_id: null,
    purposes: []
});

const selectedObject = shallowRef(null);

function onChangeObjectId(_, option) {
    selectedObject.value = option;
}

const canBeFixed = computed(() => {
    if (isNullish(form.object_id)) return false;
    if (isNullish(selectedObject.value)) return false;
    if (form.purposes.length === 0) return false;

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

async function run() {
    const confirmed = await confirm(
        'Исправить назначения',
        'Вы действительно хотите исправить назначения?'
    );
    if (!confirmed) return;

    isRunning.value = true;

    try {
        await api.object.fixLandPurposes(toRaw(form));
        notify.success('Назначения исправлены');
    } finally {
        isRunning.value = false;
    }
}

// purposes

function selectAll() {
    form.purposes = Object.keys(objectPurposesWithSectionsOptions.plot);
}

function clearAll() {
    form.purposes = [];
}
</script>

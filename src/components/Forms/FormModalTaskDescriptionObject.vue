<template>
    <div class="form-modal-task-description">
        <p class="form__label">Информация о связанном объекте:</p>
        <Spinner v-if="isLoading" class="small mt-3" label="Загрузка данных." />
        <template v-else>
            <p>Компания: {{ company?.full_name ?? '-' }}</p>
            <p>ID объекта: {{ info.objectId ?? '-' }}</p>
            <WithUnitType v-if="info.area" :unit-type="unitTypes.SQUARE_METERS">
                Полная площадь: {{ area }}
            </WithUnitType>
            <p>Адрес: {{ info.address ?? '-' }}</p>
        </template>
    </div>
</template>
<script setup>
import { computed, onMounted, ref, shallowRef } from 'vue';
import api from '@/api/api.js';
import Spinner from '@/components/common/Spinner.vue';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import { toNumberFormat } from '@/utils/formatters/number.js';

const props = defineProps({
    info: {
        type: Object,
        default: () => ({})
    }
});

const company = shallowRef(null);
const isLoading = ref(false);

const area = computed(() => {
    if (props.info.area) return toNumberFormat(props.info.area);
    return null;
});

const fetchCompany = async () => {
    isLoading.value = true;
    company.value = await api.companies.getCompany(props.info.companyId);
    isLoading.value = false;
};

onMounted(() => {
    if (props.info.companyId) {
        fetchCompany();
    }
});
</script>

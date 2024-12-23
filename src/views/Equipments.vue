<template>
    <section class="equipments-page">
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <div class="equipments-page__search white-block mb-3">
                        <div class="row mb-4 align-items-end">
                            <div class="col-12 col-md-6">
                                <FormEquipmentSearch @changed="fetchEquipments" />
                            </div>
                            <div class="col-12 offset-md-2 col-md-4">
                                <div
                                    class="d-flex align-items-md-end justify-content-end flex-column flex-md-row"
                                >
                                    <MultiSelect
                                        v-model="sortingOption"
                                        label="Сортировка"
                                        placeholder="Выберите сортировку"
                                        :options="sortingOptions"
                                        class="w-100 mb-2 mb-md-0"
                                    />
                                    <Button
                                        @click="formEquipmentIsVisible = true"
                                        class="flex-shrink-0 ml-md-2"
                                        success
                                    >
                                        + Добавить оборудование
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <PaginationClassic
                            v-if="equipments.length"
                            ref="firstPagination"
                            @next="setNextPage"
                            :pagination="pagination"
                        />
                    </div>
                    <Spinner v-if="isLoading" />
                    <EmptyData v-else-if="!equipments.length">Список оборудования пуст</EmptyData>
                    <div v-if="equipments.length" v-show="!isLoading" class="equipments-page__list">
                        <Equipment
                            v-for="equipment in equipments"
                            :key="equipment.id"
                            @edit="editEquipment(equipment)"
                            @view="viewEquipment(equipment)"
                            @toggle-passive="togglePassiveEquipment(equipment)"
                            @remove="removeEquipment(equipment)"
                            :equipment="equipment"
                            class="equipments-page__equipment"
                        />
                    </div>
                    <div v-if="equipments.length" v-show="!isLoading" class="white-block mt-3">
                        <PaginationClassic @next="setNextPage" :pagination="pagination" />
                    </div>
                </div>
            </div>
        </div>
        <teleport to="body">
            <EquipmentCardView
                v-if="viewEquipmentIsVisible"
                @close="closeViewEquipment"
                @edit="editEquipment(viewingEquipment)"
                @toggle-passive="togglePassiveEquipment(viewingEquipment)"
                @called="updateLastCallEquipment"
                @remove="removeEquipment(viewingEquipment)"
                :equipment="viewingEquipment"
                :can-edit="canEdit(viewingEquipment, 'view')"
                :can-remove="canRemove"
            />
            <FormEquipment
                v-if="formEquipmentIsVisible"
                @close="formEquipmentIsVisible = false"
                @created="onCreatedEquipment"
                @updated="onUpdatedEquipment"
                :form-data="editingEquipment"
            />
            <FormEquipmentPassive
                v-if="formEquipmentPassiveIsVisible"
                @close="formEquipmentPassiveIsVisible = false"
                @updated="onUpdatedEquipment"
                :form-data="editingEquipment"
            />
        </teleport>
    </section>
</template>

<script setup>
import FormEquipment from '@/components/Forms/Equipment/FormEquipment.vue';
import FormEquipmentSearch from '@/components/Forms/Equipment/FormEquipmentSearch.vue';
import Equipment from '@/components/Equipment/Equipment.vue';
import PaginationClassic from '@/components/common/Pagination/PaginationClassic.vue';
import Button from '@/components/common/Button.vue';
import api from '@/api/api.js';
import Spinner from '@/components/common/Spinner.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import EquipmentCardView from '@/components/Equipment/EquipmentCardView.vue';
import { useRoute, useRouter } from 'vue-router';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import { computed, ref, shallowRef, watch } from 'vue';
import { useStore } from 'vuex';
import FormEquipmentPassive from '@/components/Forms/Equipment/FormEquipmentPassive.vue';
import { equipmentOptions } from '@/const/options/equipment.options.js';
import { useConfirm } from '@/composables/useConfirm.js';
import { useNotify } from '@/utils/use/useNotify.js';
import dayjs from 'dayjs';

const route = useRoute();
const router = useRouter();
const store = useStore();

const sortingOptions = [
    {
        value: null,
        label: 'По умолчанию'
    },
    { value: 'created_at', label: 'По дате создания (сначала старые)' },
    { value: '-created_at', label: 'По дате создания (сначала новые)' },
    {
        value: 'updated_at',
        label: 'По обновлению данных (сначала старые)'
    },
    {
        value: '-updated_at',
        label: 'По обновлению данных (сначала свежие)'
    }
];

const { isLoading } = useDelayedLoader();
const { confirm } = useConfirm();
const notify = useNotify();

const formEquipmentIsVisible = shallowRef(false);
const viewEquipmentIsVisible = shallowRef(false);
const formEquipmentPassiveIsVisible = shallowRef(false);
const pagination = ref({});
const equipments = ref([]);
const editingEquipment = ref(null);
const viewingEquipment = ref(null);
const sortingOption = ref(null);

const canRemove = computed(() => store.getters.isModerator);
const canEdit = equipment => {
    return store.getters.isModerator || equipment.created_by_id == store.getters.THIS_USER.id;
};

watch(sortingOption, async value => {
    const query = { ...route.query };

    if (value) query.sort = value;
    else delete query.sort;

    delete query.page;
    await router.replace({ query });
});

const fetchEquipments = async () => {
    isLoading.value = true;

    const response = await api.equipment.list(route.query);

    if (response) {
        equipments.value = response.data;
        pagination.value = response.pagination;
    }

    isLoading.value = false;
};

const setNextPage = async number => {
    let query = { ...route.query };
    query.page = number;
    await router.replace({ query });
};

const editEquipment = equipment => {
    editingEquipment.value = equipment;
    formEquipmentIsVisible.value = true;
};

const onUpdatedEquipment = (equipment, target = null) => {
    Object.assign(target ? target : editingEquipment.value, equipment);
    editingEquipment.value = null;
};

const onCreatedEquipment = () => {
    fetchEquipments();
};

const viewEquipment = equipment => {
    viewingEquipment.value = equipment;
    viewEquipmentIsVisible.value = true;
};

const togglePassiveEquipment = equipment => {
    const isPassive = equipment.status === equipmentOptions.statusStatement.PASSIVE;

    if (isPassive) equipmentToActive(equipment);
    else equipmentToPassive(equipment);
};

const equipmentToPassive = equipment => {
    editingEquipment.value = equipment;
    formEquipmentPassiveIsVisible.value = !formEquipmentPassiveIsVisible.value;
};

const equipmentToActive = async equipment => {
    const confirmed = await confirm('Вы уверены, что хотите снять оборудование с пассива?');
    if (!confirmed) return;

    const updatedEquipment = await api.equipment.update(equipment.id, {
        ...equipment,
        status: equipmentOptions.statusStatement.ACTIVE
    });

    if (updatedEquipment) {
        notify.success('Оборудование снято с пассива');
        Object.assign(equipment, updatedEquipment);
    } else notify.info('Попробуйте позже..', 'Обновление статуса');
};

const updateLastCallEquipment = async () => {
    const confirmed = await confirm(
        'Подтвердите обновление даты последнего звонка по оборудованию. Будет установлено: ' +
            dayjs().format('D.MM.YY')
    );
    if (!confirmed) return;

    const lastCall = await api.equipment.called(viewingEquipment.value.id, {
        user_id: store.getters.THIS_USER.id,
        contact_id: viewingEquipment.value.contact_id
    });

    if (lastCall) {
        notify.success('Дата последнего звонка по объекту обновлена');
        viewingEquipment.value.last_call = lastCall;
    } else notify.info('Попробуйте позже..', 'Обновление последнего звонка');
};

const removeEquipment = async equipment => {
    const confirmed = await confirm('Вы уверены, что хотите безвозвратно удалить объект?');
    if (!confirmed) return;

    const deleted = await api.equipment.delete(equipment.id);
    if (deleted) {
        notify.success('Оборудование удалено');

        const index = equipments.value.findIndex(element => element.id === equipment.id);
        equipments.value.splice(index, 1);
    } else notify.info('Попробуйте позже..', 'Обновление последнего звонка');
};

const closeViewEquipment = () => {
    viewEquipmentIsVisible.value = false;
    viewingEquipment.value = null;
};

fetchEquipments();
</script>

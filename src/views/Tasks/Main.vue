<template>
    <section class="dashboard-tasks-page">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-12 mb-2 d-flex align-items-center">
                    <h1>Задачи</h1>
                    <DashboardTargetUser v-model="targetUser" class="ml-2" />
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-xl-3 col-xxl-2">
                    <DashboardCard>
                        <div class="dashboard-aside position-relative">
                            <DashboardTableTasksFilters
                                v-model:status="filters.status"
                                v-model:type="filters.type"
                                :counts="counts"
                                :relations="relations"
                                :target="targetUser?.id"
                            >
                                <template #filters>
                                    <MultiSelect
                                        v-model="filters.tags"
                                        label="Тэги"
                                        mode="tags"
                                        searchable
                                        :options="getTagsOptions"
                                        resolve-on-load
                                        :close-on-select="false"
                                        placeholder="&nbsp;&nbsp;Выберите тэг.."
                                    >
                                        <template #option="{ option }">
                                            <TaskTagOption :tag="option" />
                                        </template>
                                        <template #tag="{ option, disabled, handleTagRemove }">
                                            <div
                                                class="multiselect-tag"
                                                :style="{
                                                    backgroundColor: '#' + option.color,
                                                    color: '#fff'
                                                }"
                                            >
                                                <span>{{ option.label }}</span>
                                                <i
                                                    v-if="!disabled"
                                                    v-tippy="'Удалить'"
                                                    @click="handleTagRemove(option, $event)"
                                                    class="ml-1 fa-solid fa-close"
                                                />
                                            </div>
                                        </template>
                                    </MultiSelect>
                                    <ConsultantPicker
                                        v-model="filters.createdById"
                                        label="Автор"
                                        placeholder="Выберите сотрудника.."
                                        :disabled="createdByFilterIsDisabled"
                                        :options="getConsultantsOptions"
                                    />
                                    <ConsultantPicker
                                        v-model="filters.userId"
                                        label="Исполнитель"
                                        placeholder="Выберите сотрудника.."
                                        :disabled="userFilterIsDisabled"
                                        :options="getConsultantsOptions"
                                    />
                                </template>
                            </DashboardTableTasksFilters>
                        </div>
                    </DashboardCard>
                </div>
                <div class="col-xl-9 col-xxl-10">
                    <DashboardCard class="dashboard-task-table">
                        <template #header>
                            <div class="dashboard-task-table__header">
                                <Form>
                                    <FormGroup class="align-items-end">
                                        <div class="col-8 d-flex align-items-end">
                                            <Input
                                                v-model="querySearch"
                                                label="Поиск"
                                                class="w-100"
                                            />
                                            <Button
                                                @click="querySearch = null"
                                                :disabled="!querySearch?.length"
                                                class="ml-2"
                                                danger
                                            >
                                                Очистить
                                            </Button>
                                        </div>
                                        <MultiSelect
                                            v-model="sortingOption"
                                            class="offset-1 col-3"
                                            label="Сортировка"
                                            :options="sortingOptions"
                                        />
                                        <div class="col-12 mb-2">
                                            <div class="d-flex align-items-end">
                                                <AnimationTransition :speed="0.6">
                                                    <PaginationClassic
                                                        v-if="tasks.data?.length && !isFavoriteView"
                                                        @next="setNextPage"
                                                        :pagination="tasks.pagination"
                                                    />
                                                </AnimationTransition>
                                                <Button
                                                    @click="toggleFavoriteView"
                                                    :disabled="isLoading"
                                                    :active="isFavoriteView"
                                                    small
                                                    warning
                                                    icon
                                                    :badge="favoriteTasks.length"
                                                    class="ml-auto"
                                                >
                                                    <i class="fa-solid fa-star" />
                                                    <span>Избранное</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </FormGroup>
                                </Form>
                            </div>
                        </template>
                        <AnimationTransition :speed="0.2">
                            <DashboardTableFavoriteTasks
                                v-if="isFavoriteView"
                                :tasks="favoriteTasks"
                                class="mb-4"
                            />
                            <DashboardTableTasks
                                v-else
                                @task-updated="onTaskUpdated"
                                :is-loading="isLoading"
                                :tasks="tasks.data"
                            />
                        </AnimationTransition>
                        <AnimationTransition :speed="0.6">
                            <PaginationClassic
                                v-if="tasks.data?.length && !isFavoriteView"
                                @next="setNextPage"
                                class="mt-3"
                                :pagination="tasks.pagination"
                            />
                        </AnimationTransition>
                    </DashboardCard>
                </div>
            </div>
        </div>
    </section>
</template>
<script setup>
import { useStore } from 'vuex';
import { computed, onMounted, reactive, ref, shallowRef, watch } from 'vue';
import DashboardTableTasksFilters from '@/components/Dashboard/Table/DashboardTableTasksFilters.vue';
import TaskTagOption from '@/components/common/Forms/TaskTagOption.vue';
import DashboardTableTasks from '@/components/Dashboard/Table/DashboardTableTasks.vue';
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';
import Form from '@/components/common/Forms/Form.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import PaginationClassic from '@/components/common/Pagination/PaginationClassic.vue';
import ConsultantPicker from '@/components/common/Forms/ConsultantPicker/ConsultantPicker.vue';
import Button from '@/components/common/Button.vue';
import Input from '@/components/common/Forms/Input.vue';
import { useTagsOptions } from '@/composables/options/useTagsOptions.js';
import { useConsultantsOptions } from '@/composables/options/useConsultantsOptions.js';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import { taskOptions } from '@/const/options/task.options.js';
import { useQueryHash } from '@/utils/use/useQueryHash.js';
import api from '@/api/api.js';
import gsap from 'gsap';
import { debounce } from '@/utils/common/debounce.js';
import DashboardTargetUser from '@/components/Dashboard/DashboardTargetUser.vue';
import { useFavoriteTasks } from '@/composables/useFavoriteTasks.js';
import DashboardTableFavoriteTasks from '@/components/Dashboard/Table/DashboardTableFavoriteTasks.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';

const store = useStore();

const targetUser = ref({
    id: store.getters.THIS_USER.id,
    chat_member_id: store.getters.THIS_USER.chat_member_id
});

const { getTagsOptions } = useTagsOptions();
const { getConsultantsOptions } = useConsultantsOptions();
const { isLoading } = useDelayedLoader();

const filters = reactive({
    createdById: null,
    userId: null,
    tags: [],
    type: [],
    status: []
});

const sortingOptions = [
    { value: '-updated_at', label: 'По умолчанию' },
    { value: 'viewed_at', label: 'Сначала непросмотренные' },
    { value: 'created_at', label: 'Сначала старые' },
    { value: '-created_at', label: 'Сначала новые' },
    { value: 'end', label: 'Сначала истекающие' }
];

const tasks = reactive({
    data: [],
    pagination: null
});

const querySearch = shallowRef('');

const counts = ref({
    total: 0,
    accepted: 0,
    created: 0,
    done: 0,
    impossible: 0
});

const relations = ref({
    by_user: 0,
    by_created_by: 0,
    by_observer: 0
});

const sortingOption = shallowRef('-updated_at');

const createdByFilterIsDisabled = computed(() =>
    filters.type.includes(taskOptions.typeStatement.GIVEN)
);

const userFilterIsDisabled = computed(() =>
    filters.type.includes(taskOptions.typeStatement.RECEIVED)
);

watch(
    () => targetUser.value,
    value => {
        if (value != null) fetchRelationCounts();
        Promise.all([fetchCounts(), fetchTasks()]);
    }
);

watch(querySearch, () => {
    debouncedForInputTasks();
});

watch(
    () => filters.type,
    () => {
        debouncedFetchCounts();
    },
    { deep: true }
);

watch(sortingOption, () => {
    debouncedFetchTasks();
});

watch(filters, () => {
    debouncedFetchTasks();
});

const setNextPage = async page => {
    await fetchTasks(page);
};

const setModeInQuery = query => {
    filters.type.forEach(element => {
        query[element] = targetUser.value.id;
    });

    query.multiple = 1;
};

const createQuery = page => {
    const query = { page };

    if (querySearch.value?.length) query.message = querySearch.value;
    if (filters.status.length) {
        query.status = filters.status;
    }
    if (filters.type.length && targetUser.value.id) setModeInQuery(query);
    else if (targetUser.value) {
        query.created_by_id = targetUser.value.id;
        query.observer_id = targetUser.value.id;
        query.user_id = targetUser.value.id;
        query.multiple = 1;
    }
    if (sortingOption.value) query.sort = sortingOption.value;

    if (filters.createdById && !createdByFilterIsDisabled.value) {
        query.created_by_id = filters.createdById;
        query.multiple = null;
    }
    if (filters.userId && !userFilterIsDisabled.value) {
        query.user_id = filters.userId;
        query.multiple = null;
    }

    query.tag_ids = filters.tags;

    return query;
};

const createCountsQuery = () => {
    const query = {};

    if (filters.type.length && targetUser.value) {
        filters.type.forEach(element => {
            query[element] = targetUser.value.id;
        });
        query.multiple = 1;
    } else if (targetUser.value) {
        query.created_by_id = targetUser.value.id;
        query.observer_id = targetUser.value.id;
        query.user_id = targetUser.value.id;
        query.multiple = 1;
    }

    if (filters.createdById && !createdByFilterIsDisabled.value) {
        query.created_by_id = filters.createdById;
        query.multiple = null;
    }

    if (filters.userId && !userFilterIsDisabled.value) {
        query.user_id = filters.userId;
        query.multiple = null;
    }

    return query;
};

const { setHash, confirmHash } = useQueryHash('search-tasks');

const fetchTasks = async (page = 1) => {
    isLoading.value = true;
    const query = createQuery(page);
    setHash(query);

    const response = await api.task.get(query);
    if (response && confirmHash(query)) {
        tasks.data = response.data;
        tasks.pagination = response.pagination;
    }

    isLoading.value = false;
};

const { setHash: setCountsHash, confirmHash: confirmCountsHash } = useQueryHash('counts-tasks');

const fetchCounts = async () => {
    const query = createCountsQuery();
    setCountsHash(query);

    const response = await api.task.getCounts(query);
    if (response && confirmCountsHash(query)) {
        gsap.to(counts.value, {
            delay: 0.5,
            duration: 2,
            ...response
        });
    }
};

const { setHash: setRelationCountsHash, confirmHash: confirmRelationCountsHash } =
    useQueryHash('relation-counts-tasks');

const fetchRelationCounts = async () => {
    const query = {};
    if (targetUser.value) query.user_id = targetUser.value.id;
    setRelationCountsHash(query);

    const response = await api.task.getRelationCounts(query);
    if (response && confirmRelationCountsHash(query)) {
        gsap.to(relations.value, {
            delay: 0.5,
            duration: 2,
            ...response
        });
    }
};

const debouncedFetchTasks = debounce(fetchTasks, 400);
const debouncedFetchCounts = debounce(fetchCounts, 400);
const debouncedForInputTasks = debounce(fetchTasks, 500);

const onTaskUpdated = task => {
    const taskIndex = tasks.data.findIndex(element => element.id === task.id);
    if (taskIndex !== -1) Object.assign(tasks.data[taskIndex], task);
};

const init = () => {
    fetchCounts();
    fetchTasks();
    fetchRelationCounts();
};

onMounted(() => {
    init();
});

// favorites

const { fetchFavoriteTasks, favoriteTasks } = useFavoriteTasks();

onMounted(fetchFavoriteTasks);

const isFavoriteView = ref(false);

function toggleFavoriteView() {
    isFavoriteView.value = !isFavoriteView.value;
}
</script>

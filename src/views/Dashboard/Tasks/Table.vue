<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-xl-3 col-xxl-2">
                <DashboardCard>
                    <div class="dashboard-aside position-relative">
                        <DashboardTableTasksFilters
                            v-model:status="filterStatus"
                            v-model:type="filterType"
                            :counts="counts"
                            :relations="relations"
                        />
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
                                        <Input v-model="querySearch" label="Поиск" class="w-100" />
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
                                    <div class="col-12">
                                        <PaginationClassic
                                            v-if="tasks.data?.length"
                                            @next="setNextPage"
                                            :pagination="tasks.pagination"
                                            class="mb-2"
                                        />
                                    </div>
                                </FormGroup>
                            </Form>
                        </div>
                    </template>
                    <DashboardTableTasks :is-loading="isLoading" :tasks="tasks.data" />
                </DashboardCard>
            </div>
        </div>
    </div>
</template>
<script setup>
import PaginationClassic from '@/components/common/Pagination/PaginationClassic.vue';
import Input from '@/components/common/Forms/Input.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import Form from '@/components/common/Forms/Form.vue';
import Button from '@/components/common/Button.vue';
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import DashboardTableTasks from '@/components/Dashboard/Table/DashboardTableTasks.vue';
import api from '@/api/api.js';
import DashboardTableTasksFilters from '@/components/Dashboard/Table/DashboardTableTasksFilters.vue';
import { inject, onBeforeMount, reactive, ref, shallowRef, toRef, watch } from 'vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import { debounce } from '@/utils/debounce.js';
import { useQueryHash } from '@/utils/useQueryHash.js';
import gsap from 'gsap';

const $targetUser = inject('$targetUser');

const { isLoading } = useDelayedLoader();

const sortingOptions = [
    { value: '-updated_at', label: 'По умолчанию' },
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
    all: 0,
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
const filterStatus = ref([]);
const filterType = ref([]);

const targetUser = toRef($targetUser);

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
    filterStatus,
    () => {
        debouncedFetchTasks();
    },
    { deep: true }
);

watch(
    filterType,
    () => {
        debouncedFetchTasks();
        debouncedFetchCounts();
    },
    { deep: true }
);

watch(sortingOption, () => {
    debouncedFetchTasks();
});

const setNextPage = async page => {
    debouncedFetchTasks(page);
};

const setModeInQuery = query => {
    filterType.value.forEach(element => {
        query[element] = targetUser.value.id;
    });

    query.multiple = 1;
};

const createQuery = page => {
    const query = { page };

    if (querySearch.value?.length) query.message = querySearch.value;
    if (filterStatus.value.length) {
        query.status = filterStatus.value;
    }
    if (filterType.value.length) setModeInQuery(query);
    else if (targetUser.value) {
        query.created_by_id = targetUser.value.id;
        query.observer_id = targetUser.value.id;
        query.user_id = targetUser.value.id;
        query.multiple = 1;
    }
    if (sortingOption.value) query.sort = sortingOption.value;

    return query;
};

const createCountsQuery = () => {
    const query = {};

    if (filterType.value.length) {
        filterType.value.forEach(element => {
            query[element] = targetUser.value.id;
        });
    } else if (targetUser.value) {
        query.created_by_id = targetUser.value.id;
        query.observer_id = targetUser.value.id;
        query.user_id = targetUser.value.id;
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
            all: Number(response.all),
            created: Number(response.created),
            accepted: Number(response.accepted),
            done: Number(response.done),
            impossible: Number(response.impossible)
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
            by_user: Number(response.by_user),
            by_created_by: Number(response.by_created_by),
            by_observer: Number(response.by_observer)
        });
    }
};

const debouncedFetchTasks = debounce(fetchTasks, 400);
const debouncedFetchCounts = debounce(fetchCounts, 400);
const debouncedForInputTasks = debounce(fetchTasks, 500);

const init = () => {
    fetchCounts();
    fetchTasks();
    fetchRelationCounts();
};

onBeforeMount(() => {
    init();
});
</script>

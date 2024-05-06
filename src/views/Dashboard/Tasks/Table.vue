<template>
    <div class="container-fluid">
        <teleport to="body">
            <FormModalTask ref="taskForm" />
        </teleport>
        <div class="row">
            <div class="col-xl-3">
                <DashboardCard>
                    <div class="dashboard-aside">
                        <Button @click="createTask" class="w-100" success>Создать задачу</Button>
                        <div class="dashboard-aside__menu mt-3">
                            <DashboardCardNavLink
                                @click.prevent="setCurrentTaskType(taskMenuTypes.ALL)"
                                :icon="{
                                    name: 'fa-solid fa-list-ul',
                                    class: 'dashboard-bg-primary-l'
                                }"
                                :badge="counts.all"
                                :active="currentTaskStatus === taskMenuTypes.ALL"
                            >
                                Все задачи
                            </DashboardCardNavLink>
                            <DashboardCardNavLink
                                @click.prevent="setCurrentTaskType(taskMenuTypes.NEW)"
                                :icon="{
                                    name: 'fa-solid fa-plus',
                                    class: 'dashboard-bg-primary-l'
                                }"
                                :badge="counts.new"
                                :active="currentTaskStatus === taskMenuTypes.NEW"
                            >
                                Новые
                            </DashboardCardNavLink>
                            <DashboardCardNavLink
                                @click.prevent="setCurrentTaskType(taskMenuTypes.IN_PROGRESS)"
                                :icon="{
                                    name: 'fa-regular fa-hourglass-half',
                                    class: 'dashboard-bg-warning-l'
                                }"
                                :badge="counts.inProgress"
                                :active="currentTaskStatus === taskMenuTypes.IN_PROGRESS"
                            >
                                В процессе
                            </DashboardCardNavLink>
                            <DashboardCardNavLink
                                @click="setCurrentTaskType(taskMenuTypes.COMPLETED)"
                                :icon="{
                                    name: 'fa-regular fa-circle-check',
                                    class: 'dashboard-bg-success-l'
                                }"
                                :badge="counts.completed"
                                :active="currentTaskStatus === taskMenuTypes.COMPLETED"
                            >
                                Выполненные
                            </DashboardCardNavLink>
                            <DashboardCardNavLink
                                @click="setCurrentTaskType(taskMenuTypes.CANCELED)"
                                :icon="{
                                    name: 'fa-solid fa-pause',
                                    class: 'dashboard-bg-danger-l'
                                }"
                                :badge="counts.canceled"
                                :active="currentTaskStatus === taskMenuTypes.CANCELED"
                            >
                                Отложенные
                            </DashboardCardNavLink>
                            <DashboardCardNavLink
                                @click="setCurrentTaskType(taskMenuTypes.EXPIRED)"
                                :icon="{
                                    name: 'fa-solid fa-fire',
                                    class: 'dashboard-bg-warning-l'
                                }"
                                :badge="counts.expired"
                                :active="currentTaskStatus === taskMenuTypes.EXPIRED"
                            >
                                Сгоревшие
                            </DashboardCardNavLink>
                            <DashboardCardNavLink
                                @click="setCurrentTaskType(taskMenuTypes.DELETED)"
                                :icon="{
                                    name: 'fa-solid fa-trash',
                                    class: 'dashboard-bg-danger-l'
                                }"
                                :badge="counts.deleted"
                                :active="currentTaskStatus === taskMenuTypes.DELETED"
                            >
                                Удаленные
                            </DashboardCardNavLink>
                        </div>
                    </div>
                </DashboardCard>
            </div>
            <div class="col-xl-9">
                <DashboardCard class="dashboard-task-table">
                    <template #header>
                        <div class="dashboard-task-table__header">
                            <Form>
                                <FormGroup class="align-items-end">
                                    <div class="col-8 d-flex align-items-end">
                                        <Input
                                            v-model="debouncedQuerySearch"
                                            disabled
                                            label="Поиск"
                                            class="w-100"
                                        />
                                        <Button
                                            @click="querySearch = null"
                                            :disabled="!debouncedQuerySearch?.length"
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
                    <DashboardTableTasks
                        @edit="editTask"
                        :is-loading="isLoading"
                        :tasks="tasks.data"
                    />
                </DashboardCard>
            </div>
        </div>
    </div>
</template>
<script>
import PaginationClassic from '@/components/common/Pagination/PaginationClassic.vue';
import Input from '@/components/common/Forms/Input.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import Form from '@/components/common/Forms/Form.vue';
import DashboardCardNavLink from '@/components/Dashboard/Card/DashboardCardNavLink.vue';
import Button from '@/components/common/Button.vue';
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import { DebouncedQuerySearchMixin } from '@/components/common/Forms/debounced.mixins.js';
import { entityOptions } from '@/const/options/options.js';
import { mapGetters } from 'vuex';
import { waitHash } from '@/utils/index.js';
import FormModalTask from '@/components/Forms/FormModalTask.vue';
import DashboardTableTasks from '@/components/Dashboard/Table/DashboardTableTasks.vue';
import { LoaderMixin } from '@/components/Messenger/loader.mixin.js';
import api from '@/api/api.js';

export default {
    name: 'DashboardTasksTable',
    components: {
        DashboardTableTasks,
        FormModalTask,
        PaginationClassic,
        Input,
        FormGroup,
        Form,
        DashboardCardNavLink,
        Button,
        DashboardCard,
        MultiSelect
    },
    mixins: [DebouncedQuerySearchMixin, LoaderMixin],
    inject: ['$targetUserID'],
    data() {
        return {
            tasks: {
                data: [],
                pagination: null
            },
            sortingOption: '-updated_at',
            currentTaskStatus: 0,
            sortingOptions: [
                { value: '-updated_at', label: 'По умолчанию' },
                { value: 'id', label: 'По ID (возрастание)' },
                { value: '-id', label: 'По ID (убывание)' },
                { value: 'created_at', label: 'Сначала старые' },
                { value: '-created_at', label: 'Сначала новые' },
                { value: 'end', label: 'Сначала истекающие' }
            ],
            tasksTypeOptions: {
                0: { deleted: 0 },
                1: { status: 1, deleted: 0 },
                2: { status: 2, deleted: 0 },
                3: { status: 3, deleted: 0 },
                4: { status: 4, deleted: 0 },
                5: { deleted: 0, expired: 1 },
                6: { deleted: 1 }
            },
            counts: {},
            loadingState: false
        };
    },
    computed: {
        taskMenuTypes: () => entityOptions.task.statusTypes,
        ...mapGetters({ user: 'THIS_USER' }),
        originalLoader() {
            return this.loadingState;
        },
        targetUserID() {
            return this.$targetUserID();
        }
    },
    watch: {
        targetUserID() {
            Promise.all([this.fetchCounts(), this.fetchTasks()]);
        },
        '$route.query': function (newQuery, oldQuery) {
            if (waitHash(newQuery) !== waitHash(oldQuery)) {
                this.fetchTasks();
            }
        },
        async querySearch(value) {
            let query = { ...this.$route.query };

            if (value?.length) {
                query.all = value;
            } else {
                delete query.all;
            }

            await this.$router.replace({ query });
        },
        async sortingOption(value) {
            if (value) this.$router.replace({ query: { ...this.$route.query, sort: value } });
        }
    },
    methods: {
        async setNextPage(number) {
            let query = { ...this.$route.query };
            query.page = number;
            await this.$router.replace({ query });
        },
        async fetchTasks() {
            this.loadingState = true;

            const additionsQuery = this.targetUserID ? { user_id: this.targetUserID } : {};
            let query = { ...this.$route.query, ...additionsQuery };
            this.tasks = await api.task.get(query);

            this.loadingState = false;
        },
        async fetchCounts() {
            const additionsQuery = this.targetUserID ? { user_id: this.targetUserID } : {};

            const data = await Promise.all([
                api.task.getCount({ ...additionsQuery, deleted: 0 }),
                api.task.getCount({ status: 1, ...additionsQuery, deleted: 0 }),
                api.task.getCount({ status: 2, ...additionsQuery, deleted: 0 }),
                api.task.getCount({ status: 3, ...additionsQuery, deleted: 0 }),
                api.task.getCount({ status: 4, ...additionsQuery, deleted: 0 }),
                api.task.getCount({ deleted: 0, ...additionsQuery, expired: 1 }),
                api.task.getCount({ deleted: 1, ...additionsQuery })
            ]);

            if (data.length) {
                this.counts = {
                    all: data[0],
                    new: data[1],
                    inProgress: data[2],
                    completed: data[3],
                    canceled: data[4],
                    expired: data[5],
                    deleted: data[6]
                };
            }
        },
        async setCurrentTaskType(status) {
            this.currentTaskStatus = status;
            this.querySearch = '';
            this.sortingOption = this.sortingOptions[0].value;
            await this.$router.replace({ query: this.tasksTypeOptions[status] });

            if (this.$route.query.status !== this.tasksTypeOptions[status])
                await this.$router.replace({ query: this.tasksTypeOptions[status] });
        },
        async createTask() {
            const taskPayload = await this.$refs.taskForm.open();
            if (!taskPayload) return;

            taskPayload.status = 1;
            const task = await api.task.create(taskPayload);

            if (task) {
                this.tasks.data.unshift(task);
                this.tasks.pagination.totalCount++;
            }
        },
        async editTask(oldTask) {
            const taskPayload = await this.$refs.taskForm.open(oldTask);
            if (!taskPayload) return;

            const task = await api.task.update(oldTask.id, { ...oldTask, ...taskPayload });

            if (task) {
                Object.assign(oldTask, task);
            }
        },
        async setQuery() {
            const query = { ...this.$route.query };

            if (this.$route.query.status) {
                const status = Number(this.$route.query.status);

                if (status < 6 && status > 0) {
                    this.currentTaskStatus = status;
                } else {
                    delete query.status;
                    this.currentTaskStatus = 0;
                    query.deleted = 0;
                }
            } else {
                query.deleted = 0;
            }

            if (Number(this.$route.query.deleted) === 1) {
                this.currentTaskStatus = 5;
            }

            if (this.$route.query.sort) this.sortingOption = this.$route.query.sort;
            else query.sort = this.sortingOption;
            console.log(query);

            await this.$router.replace({ query: query });
        }
    },
    async created() {
        await this.setQuery();
        Promise.all([this.fetchCounts(), this.fetchTasks()]);
    }
};
</script>

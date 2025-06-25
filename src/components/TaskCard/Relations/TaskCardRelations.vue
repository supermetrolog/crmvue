<template>
    <div class="task-card-relations">
        <Loader
            v-if="isCreating || isDeleting || (isLoading && relations.length > 0)"
            small
            class="center"
        />
        <Spinner
            v-if="isLoading && relations.length === 0"
            small
            class="absolute-center"
            label="Загрузка связей.."
        />
        <div v-else class="task-card-relations__list">
            <TaskCardRelationsRow
                @link="companyRelationsModalIsVisible = true"
                :relations="relationsByGroups.company ?? []"
                label="Компании"
                icon="fa-solid fa-industry"
                item-class="task-card-relations__company"
            >
                <template #relation="{ relation }">
                    <TaskCardRelationsPreviewCompany
                        @show-contacts="$emit('show-contacts', relation.entity_id)"
                        @to-company="$emit('to-company', relation.entity_id)"
                        @unlink="deleteRelation(relation.id)"
                        :company="relation.entity"
                    />
                </template>
            </TaskCardRelationsRow>
            <TaskCardRelationsRow
                :relations="relationsByGroups.contact ?? []"
                label="Контакты"
                icon="fa-solid fa-address-card"
                disabled
            />
            <TaskCardRelationsRow
                :relations="relationsByGroups.request ?? []"
                label="Запросы"
                icon="fa-solid fa-user-clock"
                disabled
            />
            <TaskCardRelationsRow
                :relations="relationsByGroups.task ?? []"
                label="Задачи"
                icon="fa-solid fa-bolt"
                disabled
            />
        </div>
        <teleport to="body">
            <TaskCardRelationsModalCompany
                v-if="companyRelationsModalIsVisible"
                @create="createRelation"
                @close="companyRelationsModalIsVisible = false"
                :relations="relationsByGroups.company ?? []"
                :loading="isCreating"
            />
        </teleport>
    </div>
</template>

<script setup>
import api from '@/api/api.js';
import { computed, onBeforeMount, ref, shallowRef } from 'vue';
import { useNotify } from '@/utils/use/useNotify.js';
import Loader from '@/components/common/Loader.vue';
import { useConfirm } from '@/composables/useConfirm.js';
import Spinner from '@/components/common/Spinner.vue';
import TaskCardRelationsRow from '@/components/TaskCard/Relations/TaskCardRelationsRow.vue';
import TaskCardRelationsModalCompany from '@/components/TaskCard/Relations/TaskCardRelationsModalCompany.vue';
import TaskCardRelationsPreviewCompany from '@/components/TaskCard/Relations/TaskCardRelationsPreviewCompany.vue';
import { captureException } from '@sentry/vue';

const emit = defineEmits(['count-changed', 'to-company', 'show-contacts']);
const props = defineProps({
    task: {
        type: Object,
        required: true
    }
});

const notify = useNotify();

// fetch

const isError = ref(false);
const isLoading = ref(false);
const relations = shallowRef([]);

const relationsByGroups = computed(() =>
    Object.groupBy(relations.value, ({ entity_type }) => entity_type)
);

async function fetchTaskRelations() {
    isLoading.value = true;

    try {
        relations.value = await api.task.getRelations(props.task.id);
    } catch (error) {
        isError.value = true;

        captureException(error, {
            task_id: props.task.id
        });
    } finally {
        isLoading.value = false;
    }
}

onBeforeMount(() => {
    if (props.task.relations_count > 0) fetchTaskRelations();
});

// link

const companyRelationsModalIsVisible = ref(false);

async function createRelation(payload) {
    isCreating.value = true;

    try {
        await api.task.createRelations(props.task.id, [payload]);
        await fetchTaskRelations();

        emit('count-changed', relations.value.length);

        companyRelationsModalIsVisible.value = false;
    } finally {
        isCreating.value = false;
    }
}

// delete

const { confirm } = useConfirm();

const isDeleting = ref(false);

async function deleteRelation(relationId) {
    const confirmed = await confirm(
        'Удалить связь',
        'Вы уверены, что хотите удалить связь? Задача перестанет показываться в списке связанных с этой сущностью задач.'
    );
    if (!confirmed) return;

    isDeleting.value = true;

    const deleted = await api.task.deleteRelation(relationId);

    isDeleting.value = false;

    if (deleted) {
        notify.success('Связь успешно удалена.');
        await fetchTaskRelations();
        emit('count-changed', relations.value.length);
    }
}

// CREATE

const isCreating = ref(false);

// TODO: Контакты, запросы, таски и прочее
</script>

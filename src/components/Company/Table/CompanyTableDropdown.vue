<template>
    <div class="d-flex gap-1 align-items-center">
        <Tippy>
            <CompanyTableDropdownButton
                v-if="
                    requestsByGroups.active?.length ||
                    requestsByGroups.passive?.length ||
                    requestsByGroups.done?.length
                "
                v-model="requestsIsVisibleModel"
                :color="requestsIsVisibleModel ? 'success-light' : 'transparent'"
                :count="requestsByGroups.active?.length ?? 0"
                :second-count="
                    requestsByGroups.passive?.length ?? 0 + requestsByGroups.done?.length ?? 0
                "
                label="Запросы"
            />
            <template #content>
                <div>
                    <p>{{ activeRequestsPluralLabel }}</p>
                    <p>{{ archiveRequestsPluralLabel }}</p>
                    <p>{{ doneRequestsPluralLabel }}</p>
                </div>
            </template>
        </Tippy>
        <CompanyTableDropdownButton
            v-if="company.objects.length"
            v-model="objectsIsVisibleModel"
            :color="objectsIsVisibleModel ? 'success-light' : 'transparent'"
            :count="company.objects.length"
            label="Объекты"
        />
        <UiButton
            v-if="company.tasks_count"
            @click="$emit('show-tasks')"
            color="danger-light"
            icon="fa-solid fa-arrow-up-right-from-square"
            class="fs-2"
            small
            bolder
            rect
        >
            Задачи ({{ company.tasks_count }})
        </UiButton>
        <UiButton
            v-if="company.created_task_ids?.length"
            @click="$emit('show-created-tasks')"
            color="success-light"
            icon="fa-solid fa-plus"
            class="fs-2"
            small
            bolder
            rect
        >
            Созданы задачи ({{ company.created_task_ids?.length }})
        </UiButton>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import CompanyTableDropdownButton from '@/components/Company/Table/CompanyTableDropdownButton.vue';
import { Tippy } from 'vue-tippy';
import { plural } from '@/utils/plural.js';

const requestsIsVisibleModel = defineModel('requests-visible', { type: Boolean });
const objectsIsVisibleModel = defineModel('objects-visible', { type: Boolean });

defineEmits(['show-tasks', 'show-created-tasks']);

const props = defineProps({
    company: {
        type: Object,
        required: true
    }
});

const requestsGroups = {
    0: 'passive',
    1: 'active',
    2: 'done',
    5: 'passive'
};

const requestsByGroups = computed(() =>
    Object.groupBy(props.company.requests, ({ status }) => requestsGroups[status])
);

const activeRequestsPluralLabel = computed(() =>
    plural(requestsByGroups.value.active?.length ?? 0, '%d активный', '%d активных', '%d активных')
);

const archiveRequestsPluralLabel = computed(() =>
    plural(requestsByGroups.value.passive?.length ?? 0, '%d архивный', '%d архивных', '%d архивных')
);

const doneRequestsPluralLabel = computed(() =>
    plural(
        requestsByGroups.value.done?.length ?? 0,
        '%d завершен',
        '%d завершенных',
        '%d завершенных'
    )
);
</script>

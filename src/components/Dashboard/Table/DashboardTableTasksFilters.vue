<template>
    <div class="dashboard-aside__filters">
        <p class="mb-2 font-weight-semi fs-4">Фильтры</p>
        <UiButton
            @click="reset"
            class="w-100"
            :disabled="!hasAnyFilters"
            small
            color="danger-light"
            icon="fa-solid fa-trash"
            center
        >
            Сбросить
        </UiButton>
        <hr />
        <div class="dashboard-aside__menu">
            <p class="dashboard-aside__label">Статусы</p>
            <DashboardCardNavLink
                @select="toggleAll"
                :icon="{
                    name: 'fa-solid fa-list-ul',
                    class: 'dashboard-bg-primary-l'
                }"
                :badge="counts.total.toFixed()"
                :active="field.all"
            >
                Все задачи
            </DashboardCardNavLink>
            <DashboardCardNavLink
                @select="toggleField('new')"
                :icon="{
                    name: 'fa-solid fa-plus',
                    class: 'dashboard-bg-primary-l'
                }"
                :badge="counts.created.toFixed()"
                :active="field.new"
            >
                Новые
            </DashboardCardNavLink>
            <DashboardCardNavLink
                @select="toggleField('in_progress')"
                :icon="{
                    name: 'fa-regular fa-hourglass-half',
                    class: 'dashboard-bg-warning-l'
                }"
                :badge="counts.accepted.toFixed()"
                :active="field.in_progress"
            >
                В процессе
            </DashboardCardNavLink>
            <DashboardCardNavLink
                @select="toggleField('completed')"
                :icon="{
                    name: 'fa-regular fa-circle-check',
                    class: 'dashboard-bg-success-l'
                }"
                :badge="counts.done.toFixed()"
                :active="field.completed"
            >
                Выполненные
            </DashboardCardNavLink>
            <DashboardCardNavLink
                @select="toggleField('canceled')"
                :icon="{
                    name: 'fa-solid fa-pause',
                    class: 'dashboard-bg-danger-l'
                }"
                :badge="counts.impossible.toFixed()"
                :active="field.canceled"
            >
                Отложенные
            </DashboardCardNavLink>
        </div>
        <hr />
        <div>
            <p class="dashboard-aside__label mb-2">Дополнительно</p>
            <DashboardCardNavLink
                @select="toggleNotCompleted"
                :icon="{
                    name: 'fa-solid fa-hourglass-half',
                    class: 'dashboard-bg-danger-l'
                }"
                badge="-"
                :active="field.not_completed"
            >
                Невыполненные
            </DashboardCardNavLink>
        </div>
        <hr />
        <template v-if="$slots.filters">
            <div class="dashboard-aside__menu my-1">
                <slot name="filters" />
            </div>
            <hr />
        </template>
        <AnimationTransition :speed="0.4">
            <div v-if="target" class="dashboard-aside__menu mt-3">
                <DashboardCardNavLink
                    @select="toggleType('received')"
                    :badge="relations.by_user.toFixed()"
                    :active="types.received"
                >
                    {{ receivedLabel }}
                </DashboardCardNavLink>
                <DashboardCardNavLink
                    @select="toggleType('given')"
                    :badge="relations.by_created_by.toFixed()"
                    :active="types.given"
                >
                    {{ givenLabel }}
                </DashboardCardNavLink>
                <hr class="w-100" />
                <DashboardCardNavLink
                    @select="toggleIsViewing"
                    :badge="relations.by_observer.toFixed()"
                    :active="types.viewing"
                >
                    {{ viewingLabel }}
                </DashboardCardNavLink>
            </div>
        </AnimationTransition>
    </div>
</template>
<script setup>
import DashboardCardNavLink from '@/components/Dashboard/Card/DashboardCardNavLink.vue';
import { computed, shallowReactive } from 'vue';
import { taskOptions } from '@/const/options/task.options.js';
import { spliceWithPrimitive } from '@/utils/helpers/array/spliceWithPrimitive.js';
import { useStore } from 'vuex';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import UiButton from '@/components/common/UI/UiButton.vue';

const emit = defineEmits(['reset']);
const store = useStore();
const statusModelValue = defineModel('status', { type: Array, default: () => [] });
const typeModelValue = defineModel('type', { type: Array, default: () => [] });

const props = defineProps({
    counts: {
        type: Object,
        required: true
    },
    relations: {
        type: Object,
        required: true
    },
    target: Number,
    hasFilters: Boolean
});

const field = shallowReactive({
    all: false,
    new: false,
    in_progress: false,
    completed: false,
    expired: false,
    canceled: false,
    not_completed: false
});

const types = shallowReactive({
    received: false,
    given: false,
    viewing: false
});

const currentConsultant = computed(() => {
    if (!props.target) return null;
    if (props.target === store.getters.THIS_USER.id) return null;
    return store.state.User.consultants.find(element => element.id === props.target);
});

const receivedLabel = computed(() => {
    if (currentConsultant.value)
        return 'Поставленные для ' + currentConsultant.value.userProfile.medium_name;
    return 'Поставленные мне';
});

const givenLabel = computed(() => {
    if (currentConsultant.value)
        return 'Поставленные ' + currentConsultant.value.userProfile.medium_name + ' для кого-то';
    return 'Поставленные мной';
});

const viewingLabel = computed(() => {
    if (currentConsultant.value)
        return 'Где ' + currentConsultant.value.userProfile.medium_name + ' наблюдатель';
    return 'Где я наблюдатель';
});

const hasAnyFilters = computed(() => {
    return typeModelValue.value.length || statusModelValue.value.length || props.hasFilters;
});

const toggleField = key => {
    field.not_completed = false;

    field[key] = !field[key];

    const fieldId = taskOptions.clearStatusTypes[key.toUpperCase()];

    if (field.all) {
        statusModelValue.value = Object.values(taskOptions.clearStatusTypes).filter(
            element => element !== fieldId
        );
        field.all = false;
    } else {
        if (field[key]) statusModelValue.value.push(fieldId);
        else spliceWithPrimitive(statusModelValue.value, fieldId);
    }
};

const toggleType = key => {
    types[key] = !types[key];

    if (types.viewing) {
        types.viewing = false;
        const typeId = taskOptions.typeStatement.VIEWING;
        spliceWithPrimitive(typeModelValue.value, typeId);
    }

    const typeId = taskOptions.typeStatement[key.toUpperCase()];
    if (types[key]) typeModelValue.value.push(typeId);
    else spliceWithPrimitive(typeModelValue.value, typeId);
};

const toggleIsViewing = () => {
    if (types.viewing) {
        types.viewing = false;
        typeModelValue.value = [];
    } else {
        Object.keys(types).forEach(key => (types[key] = false));
        typeModelValue.value = [taskOptions.typeStatement.VIEWING];
        types.viewing = true;
    }
};

const toggleAll = () => {
    if (field.all) Object.keys(field).forEach(key => (field[key] = false));
    else Object.keys(field).forEach(key => (field[key] = true));

    statusModelValue.value = [];
};

const toggleNotCompleted = () => {
    if (!field.not_completed) reset();

    field.not_completed = !field.not_completed;

    if (field.not_completed) {
        statusModelValue.value = [
            taskOptions.clearStatusTypes.NEW,
            taskOptions.clearStatusTypes.IN_PROGRESS
        ];

        field.new = true;
        field.in_progress = true;
    } else reset();
};

const reset = () => {
    Object.keys(field).forEach(key => (field[key] = false));
    Object.keys(types).forEach(key => (types[key] = false));

    statusModelValue.value = [];
    typeModelValue.value = [];

    emit('reset');
};

const init = () => {
    statusModelValue.value.forEach(statusId => {
        field[taskOptions.statusNames[statusId].toLowerCase()] = true;
    });
};

init();
</script>

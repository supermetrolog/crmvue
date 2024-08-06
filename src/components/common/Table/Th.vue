<template>
    <th class="table__th th" :class="{ sortable: !!sort }">
        <div @click="sortHandle" class="th__content">
            <slot />
            <i
                v-if="isSorting"
                class="fas ml-1 sortable__icon"
                :class="{ 'fa-sort-amount-down': isDescSort, 'fa-sort-amount-down-alt': isAscSort }"
            />
        </div>
    </th>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const emit = defineEmits(['sort']);
const props = defineProps({
    sort: {
        type: String,
        default: null
    },
    withRouter: {
        type: Boolean,
        default: true
    }
});

const isDescSort = computed(() => {
    if (!props.withRouter) return false;

    const query = { ...route.query };
    if (!query.sort) return false;

    const words = query.sort.split(',');
    return words.some(item => item === `-${props.sort}`);
});

const isAscSort = computed(() => {
    if (!props.withRouter) return false;

    const query = { ...route.query };
    if (!query.sort) return false;

    const words = query.sort.split(',');
    return words.some(item => item === props.sort);
});

const isSorting = computed(() => Boolean(props.sort && (isDescSort.value || isAscSort.value)));

const sortHandle = () => {
    if (!props.sort) return;

    emit('sort', props.sort);
    if (!props.withRouter) return;

    const query = { ...route.query };

    if (!query.sort) {
        query.sort = props.sort;
        return router.push({ query });
    }

    const words = query.sort.split(',');
    let existSort = false;

    const newSortParams = [];

    words.forEach(element => {
        if (element === props.sort || element === `-${props.sort}`) {
            existSort = true;
            if (element === props.sort) newSortParams.push(`-${props.sort}`);
        } else {
            newSortParams.push(element);
        }
    });

    if (existSort) query.sort = newSortParams.join();
    else query.sort += `,${props.sort}`;

    if (!query.sort) {
        delete query.sort;
    }

    return router.push({ query });
};
</script>

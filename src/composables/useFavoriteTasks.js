import { createSharedComposable } from '@vueuse/core';
import { computed, ref } from 'vue';
import api from '@/api/api.js';
import { useAuth } from '@/composables/useAuth.js';
import { spliceById } from '@/utils/helpers/array/spliceById.js';
import { isNullish } from '@/utils/helpers/common/isNullish.js';
import { useCachedAsyncFunction } from '@/utils/use/useCachedAsyncFunction.js';

const favoriteTasksCacheSet = ref(new Set());

function _useFavoriteTasks() {
    const { currentUserId } = useAuth();

    const favoriteTasksEntities = ref([]);
    const favoriteTasksIsLoading = ref(false);

    const favoriteTasks = computed(() => favoriteTasksEntities.value.map(element => element.task));

    async function addTaskToFavorite(taskId) {
        const response = await api.taskFavorite.create({ task_id: taskId });

        if (response) {
            favoriteTasksEntities.value.push(response);
            favoriteTasksCacheSet.value.add(taskId);
        }
    }

    async function removeTaskFromFavorite(taskId) {
        const taskFavorite = favoriteTasksEntities.value.find(
            favoriteElement => favoriteElement.task_id === taskId
        );

        if (isNullish(taskFavorite)) return;

        const response = await api.taskFavorite.delete(taskFavorite.id);

        if (response) {
            spliceById(favoriteTasksEntities.value, taskFavorite.id);
            favoriteTasksCacheSet.value.delete(taskId);
        }
    }

    const fetchFavoriteTasks = useCachedAsyncFunction(async () => {
        favoriteTasksIsLoading.value = true;

        const response = await api.taskFavorite.list({ user_id: currentUserId.value });

        if (response) {
            favoriteTasksEntities.value = response;

            favoriteTasksCacheSet.value = new Set(
                favoriteTasksEntities.value.map(favoriteElement => favoriteElement.task_id)
            );
        }

        favoriteTasksIsLoading.value = false;
    });

    function toggleFavoriteTask(taskId) {
        return isFavoriteTask(taskId) ? removeTaskFromFavorite(taskId) : addTaskToFavorite(taskId);
    }

    function isFavoriteTask(taskId) {
        return favoriteTasksCacheSet.value.has(taskId);
    }

    fetchFavoriteTasks();

    return {
        favoriteTasks,
        isFavoriteTask,
        addTaskToFavorite,
        removeTaskFromFavorite,
        fetchFavoriteTasks,
        toggleFavoriteTask,
        favoriteTasksIsLoading
    };
}

export const useFavoriteTasks = createSharedComposable(_useFavoriteTasks);

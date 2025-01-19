import { createSharedComposable } from '@vueuse/core';
import { computed, ref } from 'vue';
import api from '@/api/api.js';
import { useAuth } from '@/composables/useAuth.js';
import { spliceById } from '@/utils/helpers/array/spliceById.js';
import { isNullish } from '@/utils/helpers/common/isNullish.js';
import { useCachedAsyncFunction } from '@/utils/use/useCachedAsyncFunction.js';
import { useNotify } from '@/utils/use/useNotify.js';

const favoriteTasksCacheSet = ref(new Set());

function _useFavoriteTasks() {
    const { currentUserId } = useAuth();
    const notify = useNotify();

    const favoriteTasksEntities = ref([]);
    const favoriteTasksIsLoading = ref(false);

    const favoriteTasks = computed(() => favoriteTasksEntities.value.map(element => element.task));

    async function addTaskToFavorite(taskId) {
        const response = await api.taskFavorite.create({ task_id: taskId });

        if (response) {
            favoriteTasksEntities.value.push(response);
            favoriteTasksCacheSet.value.add(taskId);
            notify.success('Задача добавлена в избранное.');
        }
    }

    async function removeTaskFromFavorite(taskId) {
        const taskFavorite = favoriteTasksEntities.value.find(
            favoriteElement => favoriteElement.task.id === taskId
        );

        if (isNullish(taskFavorite)) return;

        const response = await api.taskFavorite.delete(taskFavorite.id);

        if (response) {
            spliceById(favoriteTasksEntities.value, taskFavorite.id);
            favoriteTasksCacheSet.value.delete(taskId);
            notify.info('Задача удалена из избранного.');
        }
    }

    const fetchFavoriteTasks = useCachedAsyncFunction(async () => {
        favoriteTasksIsLoading.value = true;

        const response = await api.taskFavorite.list({ user_id: currentUserId.value });

        if (response) {
            favoriteTasksEntities.value = response;

            favoriteTasksCacheSet.value = new Set(
                favoriteTasksEntities.value.map(favoriteElement => favoriteElement.task.id)
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

    async function changeTaskFavoritePosition(taskId, payload, from, to) {
        const changed = await api.taskFavorite.changePosition(taskId, payload);

        if (changed) {
            const task = favoriteTasksEntities.value[from];

            if (from > to) {
                favoriteTasksEntities.value.splice(from, 1);
                favoriteTasksEntities.value.splice(to, 0, task);
            } else {
                favoriteTasksEntities.value.splice(to, 0, task);
                favoriteTasksEntities.value.splice(from, 1);
            }
        } else {
            await fetchFavoriteTasks();
        }

        return changed;
    }

    fetchFavoriteTasks();

    return {
        favoriteTasks,
        isFavoriteTask,
        addTaskToFavorite,
        removeTaskFromFavorite,
        fetchFavoriteTasks,
        toggleFavoriteTask,
        favoriteTasksIsLoading,
        favoriteTasksEntities,
        changeTaskFavoritePosition
    };
}

export const useFavoriteTasks = createSharedComposable(_useFavoriteTasks);

import { createSharedComposable } from '@vueuse/core';
import { ref } from 'vue';
import api from '@/api/api.js';
import { useAuth } from '@/composables/useAuth.js';
import { spliceById } from '@/utils/helpers/array/spliceById.js';

const favoriteTasksCacheSet = ref(new Set());

function _useFavoriteTasks() {
    const { currentUserId } = useAuth();

    const favoriteTasks = ref([]);
    const favoriteTasksIsLoading = ref(false);

    async function addTaskToFavorite(taskId) {
        const response = await api.taskFavorite.create({ task_id: taskId });

        if (response) {
            favoriteTasks.value.push(response);
            favoriteTasksCacheSet.value.add(taskId);
        }
    }

    async function removeTaskFromFavorite(taskId) {
        const response = await api.taskFavorite.delete(taskId);

        if (response) {
            spliceById(favoriteTasks.value, taskId);
            favoriteTasksCacheSet.value.delete(taskId);
        }
    }

    async function fetchFavoriteTasks() {
        favoriteTasksIsLoading.value = true;

        const response = await api.taskFavorite.list({ user_id: currentUserId.value });

        if (response) {
            favoriteTasks.value = response;

            favoriteTasksCacheSet.value = new Set(
                favoriteTasks.value.map(favoriteElement => favoriteElement.id)
            );
        }

        favoriteTasksIsLoading.value = false;
    }

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

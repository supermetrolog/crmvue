import { computed, toValue } from 'vue';
import { useAuth } from '@/composables/useAuth.js';

// TODO: Удалить чуть позже и сделать систему выдачи через модератора

const additionalConsultantIds = new Set([77]);

export function useCompanyPermissions(company) {
    const { currentUserIsModeratorOrHigher, currentUserId } = useAuth();

    const canEdit = computed(() => {
        return (
            currentUserIsModeratorOrHigher.value ||
            toValue(company).consultant_id === currentUserId.value ||
            additionalConsultantIds.has(currentUserId.value)
        );
    });

    const canDisable = computed(() => {
        return (
            currentUserIsModeratorOrHigher.value ||
            toValue(company).consultant_id === currentUserId.value ||
            additionalConsultantIds.has(currentUserId.value)
        );
    });

    return {
        canEdit,
        canDisable
    };
}

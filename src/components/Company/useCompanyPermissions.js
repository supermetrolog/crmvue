import { computed, toValue } from 'vue';
import { useAuth } from '@/composables/useAuth.js';

export function useCompanyPermissions(company) {
    const { currentUserIsModeratorOrHigher, currentUserId } = useAuth();

    const canEdit = computed(() => {
        return (
            currentUserIsModeratorOrHigher.value ||
            toValue(company).consultant_id === currentUserId.value
        );
    });

    const canDisable = computed(() => {
        return (
            currentUserIsModeratorOrHigher.value ||
            toValue(company).consultant_id === currentUserId.value
        );
    });

    return {
        canEdit,
        canDisable
    };
}

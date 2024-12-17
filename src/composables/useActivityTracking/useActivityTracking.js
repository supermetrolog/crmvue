import { onMounted, onUnmounted, ref, shallowRef } from 'vue';
import { SharedWorkerStrategy } from '@/composables/useActivityTracking/strategies/SharedWorkerStrategy.js';
import { FallbackStrategy } from '@/composables/useActivityTracking/strategies/FallbackStrategy.js';
import { useNotify } from '@/utils/use/useNotify.js';
import api from '@/api/api.js';
import { useRoute } from 'vue-router';

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 30 * 1000; // 30 seconds

export function useActivityTracking() {
    let strategy;

    const isConnected = ref(false);
    const error = shallowRef(null);

    const notify = useNotify();
    const route = useRoute();

    function handleError(err) {
        error.value = err;
        notify.info('Проблемы с подключением к серверу', 'Система активности');
    }

    async function updateOnlineStatus(data, attempt = 1) {
        try {
            await api.user.activity({ last_page: route.path });
        } catch (err) {
            if (attempt < MAX_RETRY_ATTEMPTS) {
                setTimeout(() => {
                    updateOnlineStatus(data, attempt + 1);
                }, RETRY_DELAY);
            } else {
                handleError(err);
            }
        }
    }

    function initializeStrategy() {
        if (typeof SharedWorker !== 'undefined') {
            strategy = new SharedWorkerStrategy(
                handleError,
                connected => (isConnected.value = connected),
                updateOnlineStatus
            );
        } else {
            strategy = new FallbackStrategy(
                handleError,
                connected => (isConnected.value = connected),
                updateOnlineStatus
            );
        }

        strategy.initialize();
    }

    onMounted(initializeStrategy);

    onUnmounted(() => {
        if (strategy) {
            strategy.cleanup();
            strategy = null;
        }
    });

    return {
        isConnected,
        error
    };
}

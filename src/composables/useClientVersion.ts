import { createSharedComposable, useDocumentVisibility, useLocalStorage } from '@vueuse/core';
import { ref, watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { LOCALSTORAGE_PREFIX } from '@/services/localStorage';
import { isNullish } from '@/utils/helpers/common/isNullish';

export function compareVersions(a: string, b: string): number {
    const aParts = a.split('.').map(Number);
    const bParts = b.split('.').map(Number);

    const maxLength = Math.max(aParts.length, bParts.length);

    for (let i = 0; i < maxLength; i++) {
        const aNum = aParts[i] || 0;
        const bNum = bParts[i] || 0;

        if (aNum > bNum) return 1;
        if (aNum < bNum) return -1;
    }

    return 0;
}

interface ClientMeta {
    version: string;
    buildDate: string;
}

const STORAGE_KEY = 'app_version';
const CHECK_INTERVAL_MS = 1000 * 60 * 15;

interface StoredData {
    lastCheck: number | null;
    isOutdated: boolean;
    version: string | null;
}

export const useClientVersion = createSharedComposable(() => {
    const isOutdated = ref(false);
    const currentVersion = __APP_VERSION__;
    const router = useRouter();

    const autoChecking = ref(true);
    const isLoading = ref(false);

    const storage = useLocalStorage<StoredData>(`${LOCALSTORAGE_PREFIX}${STORAGE_KEY}`, {
        lastCheck: null,
        isOutdated: true,
        version: null
    });

    async function checkVersion() {
        if (isLoading.value || !autoChecking.value) return;

        const now = Date.now();

        if (isNullish(storage.value.version)) {
            storage.value = {
                lastCheck: now,
                isOutdated: false,
                version: currentVersion
            };

            return;
        }

        if (compareVersions(storage.value.version, currentVersion) > 0) {
            await updateVersion();
            return;
        }

        if (now - storage.value.lastCheck! < CHECK_INTERVAL_MS) {
            isOutdated.value = storage.value.isOutdated;
            return;
        } else {
            await updateVersion();
        }
    }

    async function updateVersion() {
        const now = Date.now();

        try {
            isLoading.value = true;

            const meta = await axios.get<ClientMeta>(
                import.meta.env.VITE_VUE_APP_HOST + '/meta.json?_ts=' + now
            );

            const isVersionMismatch = meta.data.version !== currentVersion;

            isOutdated.value = isVersionMismatch;
            storage.value = {
                lastCheck: now,
                isOutdated: isVersionMismatch,
                version: meta.data.version
            };

            isLoading.value = false;
        } catch (e) {
            console.warn('[VersionCheck] Error fetching version:', e);
        }
    }

    const documentVisibility = useDocumentVisibility();

    watch(documentVisibility, value => {
        if (value === 'visible') {
            void checkVersion();
        }
    });

    router.afterEach(() => {
        void checkVersion();
    });

    void checkVersion();

    function stopAutoChecking() {
        autoChecking.value = false;
    }

    function resumeAutoChecking() {
        autoChecking.value = true;
    }

    return {
        isOutdated,
        checkVersion,
        currentVersion,
        isLoading,
        stopAutoChecking,
        resumeAutoChecking
    };
});

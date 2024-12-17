<template>
    <div class="account-section">
        <p class="account-section__title">Список активных сессий</p>
        <div class="account-section__actions mb-2">
            <Button
                @click="dropSessions"
                :disabled="isLoading || isUpdating || sessions.length === 1"
                small
                icon
                danger
            >
                <span>Отозвать все сессии</span>
                <i class="fa-solid fa-ban"></i>
            </Button>
            <Button @click="fetchSessions" :disabled="isLoading || isUpdating" small icon>
                <span>Обновить</span>
                <i class="fa-solid fa-rotate" />
            </Button>
        </div>
        <div class="account-sessions position-relative">
            <div v-if="isLoading" class="account-sessions__list row">
                <AccountSessionSkeleton
                    v-for="i in lastElementsCount"
                    :key="i"
                    class="col-12 col-xxl-6"
                />
            </div>
            <div v-else class="account-sessions__list row">
                <AccountSession
                    v-for="session in sessions"
                    :key="session.id"
                    @logout="logoutSession(session)"
                    class="col-12 col-xxl-6"
                    :session="session"
                    :current="currentTokenId == session.id"
                />
            </div>
        </div>
    </div>
</template>
<script setup>
import AccountSession from '@/components/Account/AccountSession.vue';
import { onMounted, ref, shallowRef } from 'vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import api from '@/api/api.js';
import { useStore } from 'vuex';
import AccountSessionSkeleton from '@/components/Account/AccountSessionSkeleton.vue';
import { useSkeleton } from '@/composables/useSkeleton.js';
import { useConfirm } from '@/composables/useConfirm.js';
import { useNotify } from '@/utils/use/useNotify.js';
import Button from '@/components/common/Button.vue';
import { getAccessTokenFromLocalStorage } from '@/services/localStorage.js';
import { spliceById } from '@/utils/helpers/array/spliceById.js';

const store = useStore();
const { isLoading } = useDelayedLoader();
const { confirm } = useConfirm();
const notify = useNotify();

const isUpdating = shallowRef(false);
const sessions = ref([]);
const { lastElementsCount } = useSkeleton(sessions, { defaultCounts: 6 });
const { accessTokenId: currentTokenId } = getAccessTokenFromLocalStorage();

const fetchSessions = async () => {
    isLoading.value = true;
    sessions.value = await api.user.sessions.list(store.getters.THIS_USER.id);
    isLoading.value = false;
};

const logoutSession = async session => {
    const confirmed = await confirm('Вы действительно хотите отозвать сессию?');
    if (!confirmed) return;

    isUpdating.value = true;
    session.updating = true;

    const deleted = await api.session.delete(session.id);
    session.updating = false;

    if (deleted) {
        spliceById(sessions.value, session.id);
        notify.success('Сессия успешно отозвана.');
    }
    isUpdating.value = false;
};

const dropSessions = async () => {
    const confirmed = await confirm(
        'Вы действительно хотите отозвать все ваши сессии (кроме текущей)?'
    );
    if (!confirmed) return;

    isUpdating.value = true;

    const dropped = await api.user.sessions.drop(store.getters.THIS_USER.id);
    if (dropped) {
        notify.success('Все ваши сессии (кроме текущей) успешно отозваны.');
        await fetchSessions();
    }

    isUpdating.value = false;
};

onMounted(() => {
    fetchSessions();
});
</script>

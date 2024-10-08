<template>
    <div class="users-all">
        <teleport to="body">
            <FormUser
                v-if="formIsVisible"
                @close="closeForm"
                @created="fetchUsers"
                @updated="fetchUsers"
                :form-data="editingUser"
            />
        </teleport>
        <div class="row">
            <div class="col-12 col-lg-10 mx-auto mb-2">
                <div class="d-flex align-items-end">
                    <Form class="w-100 d-flex align-items-end gap-2">
                        <Input
                            v-model="querySearch"
                            placeholder="ФИО, номер, email"
                            label="Поиск"
                            class="w-100"
                        />
                        <Button
                            @click="querySearch = null"
                            :disabled="querySearch == null || querySearch.length === 0"
                        >
                            Очистить
                        </Button>
                    </Form>
                    <Button @click="formIsVisible = true" success class="ml-4 flex-shrink-0">
                        Создать пользователя
                    </Button>
                </div>
            </div>
            <div class="col-12 col-lg-10 mx-auto">
                <Loader v-if="isLoading" />
                <AnimationTransition :speed="0.2">
                    <UserTable
                        v-if="preparedUsers.length"
                        @edit="editUser"
                        @deleted="fetchUsers"
                        @show-sessions="showSessions"
                        :users="preparedUsers"
                    />
                    <EmptyData v-else>Сотрудник не найден..</EmptyData>
                </AnimationTransition>
            </div>
        </div>
        <Teleport to="body">
            <Modal
                @close="sessionsIsVisible = false"
                width="1000"
                :show="sessionsIsVisible"
                title="Просмотр сессий"
            >
                <Button
                    v-if="sessions.length"
                    @click="dropSessions"
                    :disabled="sessionsIsLoading || sessionsIsUpdating"
                    class="mb-2"
                    small
                    danger
                    icon
                >
                    <i class="fa-solid fa-ban" />
                    <span>Отозвать все сессии</span>
                </Button>
                <div class="account-sessions position-relative">
                    <div v-if="sessionsIsLoading" class="account-sessions__list row">
                        <AccountSessionSkeleton v-for="i in 6" :key="i" class="col-12 col-xxl-6" />
                    </div>
                    <div v-else-if="sessions.length" class="account-sessions__list row">
                        <AccountSession
                            v-for="session in sessions"
                            :key="session.id"
                            @logout="logoutSession(session)"
                            class="col-12 col-xxl-6"
                            :session="session"
                        />
                    </div>
                    <EmptyData v-else>Список сессий пуст</EmptyData>
                </div>
            </Modal>
        </Teleport>
    </div>
</template>

<script setup>
import { useStore } from 'vuex';
import Loader from '@/components/common/Loader.vue';
import UserTable from '@/components/User/UserTable.vue';
import FormUser from '@/components/Forms/FormUser.vue';
import { computed, onMounted, ref, shallowRef } from 'vue';
import Button from '@/components/common/Button.vue';
import Form from '@/components/common/Forms/Form.vue';
import Input from '@/components/common/Forms/Input.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import Modal from '@/components/common/Modal.vue';
import AccountSessionSkeleton from '@/components/Account/AccountSessionSkeleton.vue';
import AccountSession from '@/components/Account/AccountSession.vue';
import api from '@/api/api.js';
import { spliceById } from '@/utils/index.js';
import { useNotify } from '@/utils/useNotify.js';
import { useConfirm } from '@/composables/useConfirm.js';

const store = useStore();
const notify = useNotify();
const { confirm } = useConfirm();

const formIsVisible = shallowRef(false);
const editingUser = ref(null);
const isLoading = shallowRef(false);
const querySearch = shallowRef(null);
const sessionsIsVisible = shallowRef(false);
const sessionsIsLoading = shallowRef(false);
const sessionsIsUpdating = shallowRef(false);
const sessions = ref([]);
const sessionsUserId = shallowRef(null);

const searchParams = computed(() => {
    return store.getters.USERS.map(
        element =>
            element.username +
            ' ' +
            element.userProfile.full_name.toLowerCase() +
            ' ' +
            element.userProfile.phones
                .map(el => `${el.phone.replace(/\D/g, '')} ${el.phone.replaceAll(' ', '')}`)
                .join(' ') +
            ' ' +
            element.userProfile.emails.map(el => el.email).join(' ')
    );
});

const preparedUsers = computed(() => {
    if (querySearch.value === null || querySearch.value.length === 0) return store.getters.USERS;

    const preparedQuerySearch = querySearch.value.toLowerCase();

    return store.getters.USERS.filter((element, key) =>
        searchParams.value[key].includes(preparedQuerySearch)
    );
});

const closeForm = () => {
    formIsVisible.value = false;
    editingUser.value = null;
};

const editUser = user => {
    editingUser.value = user;
    formIsVisible.value = true;
};

const fetchUsers = async () => {
    isLoading.value = true;
    await store.dispatch('FETCH_USERS');
    isLoading.value = false;
};

const fetchSessions = async userId => {
    sessionsIsLoading.value = true;
    sessions.value = await api.user.sessions.list(userId);
    sessionsIsLoading.value = false;
};

const showSessions = userId => {
    sessionsIsVisible.value = true;
    sessionsUserId.value = userId;
    fetchSessions(userId);
};

const logoutSession = async session => {
    const confirmed = await confirm('Вы действительно хотите отозвать сессию?');
    if (!confirmed) return;

    sessionsIsUpdating.value = true;
    session.updating = true;

    const deleted = await api.session.delete(session.id);
    session.updating = false;
    if (deleted) {
        spliceById(sessions.value, session.id);
        notify.success('Сессия успешно отозвана.');
    }
    sessionsIsUpdating.value = false;
};

const dropSessions = async () => {
    const confirmed = await confirm('Вы действительно хотите отозвать все сессии сотрудника?');
    if (!confirmed) return;

    sessionsIsUpdating.value = true;

    const dropped = await api.user.sessions.drop(sessionsUserId.value);
    if (dropped) {
        notify.success('Все сессии сотрудника успешно отозваны.');
        await fetchSessions(sessionsUserId.value);
    }

    sessionsIsUpdating.value = false;
};

onMounted(() => {
    fetchUsers();
});
</script>

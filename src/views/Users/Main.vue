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
                        :users="preparedUsers"
                    />
                    <EmptyData v-else>Сотрудник не найден..</EmptyData>
                </AnimationTransition>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useStore } from 'vuex';
import Loader from '@/components/common/Loader.vue';
import UserTable from '@/components/User/UserTable.vue';
import FormUser from '@/components/Forms/FormUser.vue';
import { computed, ref, shallowRef } from 'vue';
import Button from '@/components/common/Button.vue';
import Form from '@/components/common/Forms/Form.vue';
import Input from '@/components/common/Forms/Input.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';

const store = useStore();

const formIsVisible = shallowRef(false);
const editingUser = ref(null);
const isLoading = shallowRef(false);
const querySearch = shallowRef(null);

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

fetchUsers();
</script>

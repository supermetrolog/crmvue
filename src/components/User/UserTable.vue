<template>
    <div class="users-table">
        <teleport to="body">
            <Modal
                @close="clickCloseModal"
                :show="userForDelete"
                title="Удаление контакта"
                width="600"
            >
                <div class="row no-gutters">
                    <div class="col-12 text-center">
                        <h4 class="text-dark">
                            Вы уверены что хотите удалить пользователя
                            <span class="text-grey">
                                "{{ userForDelete.userProfile.first_name }}
                                {{ userForDelete.userProfile.middle_name }}"
                            </span>
                            ?
                        </h4>
                        <h5 class="m-0 text-success_alt">Username: {{ userForDelete.username }}</h5>
                    </div>
                    <div class="col-12 mt-4 text-center">
                        <Loader v-if="deleteLoader" />
                        <div class="list justify-content-center">
                            <Button
                                @click="deleteUser(userForDelete)"
                                danger
                                :disabled="deleteLoader"
                            >
                                Удалить
                            </Button>
                            <Button @click="clickCloseModal" :disabled="deleteLoader">
                                Отменить
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </teleport>
        <Table>
            <template #thead>
                <Tr>
                    <Th></Th>
                    <Th>ФИ</Th>
                    <Th>Контакты</Th>
                    <Th>Роль</Th>
                    <Th>Добавочный</Th>
                    <Th>Дата создания</Th>
                    <Th>Дата обновления</Th>
                    <Th></Th>
                </Tr>
            </template>
            <template v-if="!loader" #tbody>
                <Tr v-for="user in users" :key="user.id">
                    <Td class="avatar-container">
                        <Avatar :src="user.userProfile.avatar" />
                    </Td>
                    <Td class="text-left">
                        {{ user.userProfile.middle_name }}
                        {{ user.userProfile.first_name }}
                    </Td>
                    <Td>
                        <div>
                            <PhoneNumber
                                v-for="phone in user.userProfile.phones"
                                :key="phone"
                                :phone="phone"
                            />
                            <a
                                v-for="email in user.userProfile.emails"
                                :key="email.email"
                                :href="'mailto:' + email.email"
                                class="d-block"
                            >
                                {{ email.email }}
                            </a>
                        </div>
                    </Td>
                    <Td>
                        <p>&#8212;</p>
                    </Td>
                    <Td>
                        <span v-if="user.userProfile.caller_id" class="square-badge">
                            {{ user.userProfile.caller_id }}
                        </span>
                        <p v-else>&#8212;</p>
                    </Td>
                    <Td class="date">
                        {{ user.created_at_format }}
                    </Td>
                    <Td class="date">
                        {{ user.updated_at_format }}
                    </Td>
                    <Td class="action">
                        <HoverActionsButton @click="$emit('clickEdit', user)" class="mb-1">
                            <i class="fas fa-pen"></i>
                        </HoverActionsButton>
                        <HoverActionsButton @click="clickDeleteUser(user)">
                            <i class="fas fa-trash-alt"></i>
                        </HoverActionsButton>
                    </Td>
                </Tr>
            </template>
        </Table>
    </div>
</template>

<script>
import Table from '@/components/common/Table/Table.vue';
import Tr from '@/components/common/Table/Tr.vue';
import Th from '@/components/common/Table/Th.vue';
import Td from '@/components/common/Table/Td.vue';
import { mapActions } from 'vuex';
import Modal from '@/components/common/Modal.vue';
import Loader from '@/components/common/Loader.vue';
import Button from '@/components/common/Button.vue';
import Avatar from '@/components/common/Avatar.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';

export default {
    name: 'UserTable',
    components: {
        HoverActionsButton,
        Avatar,
        Button,
        Loader,
        Modal,
        Table,
        Tr,
        Th,
        Td
    },
    props: {
        users: {
            type: Array
        }
    },
    data() {
        return {
            loader: false,
            userForDelete: false,
            deleteLoader: false
        };
    },
    methods: {
        ...mapActions(['DELETE_USER']),
        clickCloseModal() {
            this.userForDelete = null;
        },
        clickDeleteUser(user) {
            this.userForDelete = user;
        },
        async deleteUser(user) {
            this.deleteLoader = true;
            await this.DELETE_USER(user.id);
            this.$emit('deletedUser');
            this.deleteLoader = false;
            this.userForDelete = null;
        }
    }
};
</script>

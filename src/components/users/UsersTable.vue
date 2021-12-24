<template>
  <div class="users-table">
    <Modal
      title="Удаление контакта"
      class="autosize"
      @close="clickCloseModal"
      v-if="userForDelete"
    >
      <div class="row no-gutters">
        <div class="col-12 text-center">
          <h4 class="text-dark">
            Вы уверены что хотите удалить пользователя
            <span class="text-grey"
              >"{{ userForDelete.userProfile.first_name }}
              {{ userForDelete.userProfile.middle_name }}"</span
            >
            ?
          </h4>
          <h5 class="m-0 text-success_alt">
            Username: {{ userForDelete.username }}
          </h5>
        </div>
        <div class="col-12 mt-4 text-center">
          <Loader class="center small" v-if="deleteLoader" />
          <button
            class="btn btn-danger"
            :disabled="deleteLoader"
            @click="deleteUser(userForDelete)"
          >
            Удалить
          </button>
          <button
            class="btn btn-primary ml-1"
            @click="clickCloseModal"
            :disabled="deleteLoader"
          >
            Нет
          </button>
        </div>
      </div>
    </Modal>
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
      <template #tbody v-if="!loader">
        <Tr v-for="user in users" :key="user.id">
          <Td>
            <div class="avatar">
              <img
                :src="`http://crmka/uploads/${user.userProfile.avatar}`"
                alt="Аватар"
              />
            </div>
          </Td>

          <Td>
            {{ user.userProfile.middle_name }}
            {{ user.userProfile.first_name }}
          </Td>
          <Td>
            <div v-if="user.userProfile.contacts">
              <PhoneNumber
                v-for="phone in user.userProfile.contacts.phones"
                :key="phone"
                :phone="phone"
              />
              <a
                :href="'mailto:' + email"
                v-for="email in user.userProfile.contacts.emails"
                :key="email"
              >
                {{ email }}
              </a>
            </div>
          </Td>
          <Td> - </Td>
          <Td>
            <span class="square-badge">
              {{ user.userProfile.caller_id }}
            </span>
          </Td>
          <Td>
            {{ user.created_at }}
          </Td>
          <Td>
            {{ user.updated_at }}
          </Td>
          <Td>
            <button
              class="btn btn-action text-primary"
              @click="$emit('clickEdit', user)"
            >
              <i class="fas fa-user-edit"></i>
            </button>
            <button
              class="btn btn-action text-danger"
              @click="clickDeleteUser(user)"
            >
              <i class="fas fa-trash-alt"></i>
            </button>
          </Td>
        </Tr>
      </template>
    </Table>
  </div>
</template>

<script>
import Table from "@/components/table/Table";
import Tr from "@/components/table/Tr";
import Th from "@/components/table/Th";
import Td from "@/components/table/Td";
import PhoneNumber from "@/components/PhoneNumber";
import { mapActions } from "vuex";
export default {
  name: "UsersTable",
  components: {
    Table,
    Tr,
    Th,
    Td,
    PhoneNumber,
  },
  data() {
    return {
      loader: false,
      userForDelete: false,
      deleteLoader: false,
    };
  },
  props: {
    users: {
      type: Array,
    },
  },
  methods: {
    ...mapActions(["DELETE_USER"]),
    clickCloseModal() {
      this.userForDelete = null;
    },
    clickDeleteUser(user) {
      console.log(user);
      this.userForDelete = user;
    },
    async deleteUser(user) {
      this.deleteLoader = true;
      await this.DELETE_USER(user.id);
      this.$emit("deletedUser");
      this.deleteLoader = false;
      this.userForDelete = null;
    },
  },
};
</script>

<style>
</style>
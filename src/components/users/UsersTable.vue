<template>
  <div class="users-table">
    <transition
      mode="out-in"
      enter-active-class="animate__animated animate__zoomIn for__modal absolute"
      leave-active-class="animate__animated animate__zoomOut for__modal absolute"
    >
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
    </transition>

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
          <Td class="avatar-container">
            <div class="avatar mx-auto">
              <img :src="getAvatarUrl(user.userProfile.avatar)" alt="Аватар" />
            </div>
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
                :href="'mailto:' + email.email"
                v-for="email in user.userProfile.emails"
                :key="email.email"
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
            <span class="square-badge" v-if="user.userProfile.caller_id">
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
import Table from "@/components/common/table/Table";
import Tr from "@/components/common/table/Tr";
import Th from "@/components/common/table/Th";
import Td from "@/components/common/table/Td";
import PhoneNumber from "@/components/common/PhoneNumber";
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
    getAvatarUrl(avatarName) {
      return this.$apiUrlHelper.getUserAvatarUrl(avatarName);
    },
  },
};
</script>

<style>
</style>
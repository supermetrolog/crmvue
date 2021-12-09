<template>
  <div class="users-table">
    <Loader v-if="loader" />
    <Table>
      <template #thead>
        <Tr>
          <Th></Th>
          <Th>ФИ</Th>
          <Th>Роль</Th>
          <Th>Дата создания</Th>
          <Th></Th>
        </Tr>
      </template>
      <template #tbody v-if="!loader">
        <Tr v-for="user in USERS" :key="user.id">
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
          <Td> - </Td>
          <Td>
            {{ user.created_at }}
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
              @click="$emit('clickDelete', user)"
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
import { mapActions, mapGetters } from "vuex";
export default {
  name: "UsersTable",
  components: {
    Table,
    Tr,
    Th,
    Td,
  },
  data() {
    return {
      loader: false,
    };
  },
  computed: {
    ...mapGetters(["USERS"]),
  },
  methods: {
    ...mapActions(["FETCH_USERS"]),
    async getUsers() {
      this.loader = true;
      await this.FETCH_USERS();
      this.loader = false;
    },
  },
  mounted() {
    this.getUsers();
  },
};
</script>

<style>
</style>
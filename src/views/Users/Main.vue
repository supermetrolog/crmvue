<template>
    <div class="users-all">
        <transition
            mode="out-in"
            enter-active-class="animate__animated animate__zoomIn for__modal absolute"
            leave-active-class="animate__animated animate__zoomOut for__modal absolute"
        >
            <FormUser
                @closeUserForm="clickCloseUserForm"
                v-if="userFormVisible"
                :formdata="userForUpdate"
                @created="getUsers"
                @updated="getUsers"
            />
        </transition>
        <div class="row">
            <div class="col-7 mx-auto">
                <div class="row">
                    <div class="col-12 mt-2 mb-4">
                        <button class="btn btn-primary scale" @click="clickOpenUserForm">
                            Создать пользователя
                        </button>
                    </div>
                    <div class="col-12">
                        <Loader v-if="loader" class="center"/>
                        <UserTable
                            @clickEdit="clickOpenUserFormForUpdate"
                            @deletedUser="getUsers"
                            :users="USERS"
                            v-if="USERS.length"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import Loader from "@/components/common/Loader.vue";
import UserTable from "@/components/User/UserTable.vue";
import FormUser from "@/components/forms/templates/FormUser.vue";

export default {
    name: "UsersMain",
    data() {
        return {
            userFormVisible: false,
            userForUpdate: null,
            loader: false,
        };
    },
    components: {
        FormUser,
        UserTable,
        Loader
    },
    computed: {
        ...mapGetters(["USERS"]),
    },
    methods: {
        ...mapActions(["FETCH_USERS", "DELETE_USER"]),
        clickOpenUserForm() {
            this.userFormVisible = true;
        },
        clickCloseUserForm() {
            this.userForUpdate = null;
            this.userFormVisible = false;
        },
        clickOpenUserFormForUpdate(user) {
            this.userForUpdate = user;
            this.userFormVisible = true;
        },
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

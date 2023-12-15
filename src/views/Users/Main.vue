<template>
    <div class="users-all">
        <AnimationTransition>
            <FormUser
                v-if="userFormVisible"
                @closeUserForm="clickCloseUserForm"
                @created="getUsers"
                @updated="getUsers"
                :formdata="userForUpdate"
            />
        </AnimationTransition>
        <div class="row">
            <div class="col-7 mx-auto">
                <div class="row">
                    <div class="col-12 mt-2 mb-4">
                        <button @click="clickOpenUserForm" class="btn btn-primary scale">Создать пользователя</button>
                    </div>
                    <div class="col-12">
                        <Loader v-if="loader" class="center" />
                        <UserTable
                            v-if="USERS.length"
                            @clickEdit="clickOpenUserFormForUpdate"
                            @deletedUser="getUsers"
                            :users="USERS"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Loader from '@/components/common/Loader.vue';
import UserTable from '@/components/User/UserTable.vue';
import FormUser from '@/components/Forms/FormUser.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';

export default {
    name: 'UsersMain',
    components: {
        AnimationTransition,
        FormUser,
        UserTable,
        Loader
    },
    data() {
        return {
            userFormVisible: false,
            userForUpdate: null,
            loader: false
        };
    },
    computed: {
        ...mapGetters(['USERS'])
    },
    methods: {
        ...mapActions(['FETCH_USERS', 'DELETE_USER']),
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
        }
    },
    mounted() {
        this.getUsers();
    }
};
</script>

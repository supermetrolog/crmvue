<template>
    <section class="dashboard-tasks-page">
        <div class="container-fluid">
            <div class="row mb-4">
                <div class="col-12 mb-2 d-flex align-items-center">
                    <h1>Задачи</h1>
                    <DashboardTargetUser v-model="targetUserID" />
                </div>
                <div class="col-6">
                    <router-link
                        v-slot="{ isActive, navigate }"
                        :to="{ name: 'dashboard-tasks-board' }"
                    >
                        <Button @click="navigate" :success="isActive" class="w-100">Доска</Button>
                    </router-link>
                </div>
                <div class="col-6">
                    <router-link
                        v-slot="{ isActive, navigate }"
                        :to="{ name: 'dashboard-tasks-table' }"
                    >
                        <Button @click="navigate" :success="isActive" class="w-100">Таблица</Button>
                    </router-link>
                </div>
            </div>
        </div>
        <router-view v-slot="{ Component }">
            <AnimationTransition :speed="0.1">
                <component :is="Component" />
            </AnimationTransition>
        </router-view>
    </section>
</template>
<script>
import Button from '@/components/common/Button.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import Form from '@/components/common/Forms/Form.vue';
import Modal from '@/components/common/Modal.vue';
import UserPicker from '@/components/common/Forms/UserPicker/UserPicker.vue';
import DashboardTargetUser from '@/components/Dashboard/DashboardTargetUser.vue';
import { mapGetters } from 'vuex';
export default {
    name: 'DashboardTasksMain',
    components: {
        DashboardTargetUser,
        UserPicker,
        Modal,
        Form,
        DashboardChip,
        AnimationTransition,
        Button
    },
    provide() {
        return {
            $targetUserID: () => this.targetUserID
        };
    },
    data() {
        return {
            targetUserID: null
        };
    },
    computed: {
        ...mapGetters(['THIS_USER'])
    },
    created() {
        this.targetUserID = this.THIS_USER.id;
    }
};
</script>

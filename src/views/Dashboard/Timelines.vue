<template>
    <section class="dashboard-tasks-page">
        <div class="container-fluid">
            <div class="row mb-4">
                <div class="col-12 mb-2 d-flex align-items-center">
                    <h1>Таймлайны</h1>
                    <DashboardTargetUser v-model="targetUserID" />
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
export default {
    name: 'DashboardTimelines',
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
    }
};
</script>

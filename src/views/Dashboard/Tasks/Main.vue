<template>
    <section class="dashboard-tasks-page">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-12 mb-2 d-flex align-items-center">
                    <h1>Задачи</h1>
                    <DashboardTargetUser v-model="targetUser" />
                    <Switch
                        v-if="false"
                        v-model="isBoardMode"
                        @change="changeMode"
                        class="ml-auto"
                        false-title="Таблица"
                        true-title="Доска"
                    />
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
<script setup>
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import DashboardTargetUser from '@/components/Dashboard/DashboardTargetUser.vue';
import { useStore } from 'vuex';
import Switch from '@/components/common/Forms/Switch.vue';
import { provide, ref, shallowRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const store = useStore();
const route = useRoute();
const router = useRouter();

const targetUser = ref({
    id: store.getters.THIS_USER.id,
    chat_member_id: store.getters.THIS_USER.chat_member_id
});
const isBoardMode = shallowRef(false);

provide('$targetUser', () => targetUser.value);

const changeMode = () => {
    router.push({ name: isBoardMode.value ? 'dashboard-tasks-board' : 'dashboard-tasks-table' });
};

if (route.name === 'dashboard-tasks-board') isBoardMode.value = true;
</script>

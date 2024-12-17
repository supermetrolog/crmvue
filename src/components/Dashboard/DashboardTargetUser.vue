<template>
    <div class="d-flex">
        <DashboardChip class="dashboard-bg-success-l" with-icon>
            <span>{{ modelValue ? targetUsername : 'Общее' }}</span>
        </DashboardChip>
        <DashboardChip
            v-tippy="'Выберите сотрудника для просмотра'"
            @click="formIsVisible = true"
            class="dashboard-page__switch"
            with-icon
        >
            <i class="fa-solid fa-pen" />
        </DashboardChip>
        <DashboardChip
            v-if="modelValue"
            v-tippy="'Отменить выбор'"
            @click="modelValue = null"
            class="dashboard-page__switch"
            with-icon
        >
            <i class="fa-solid fa-xmark" />
        </DashboardChip>
        <teleport to="body">
            <Modal @close="formIsVisible = false" :show="formIsVisible" title="Выбор сотрудника">
                <UserPicker v-model="value" single :users="consultants" />
            </Modal>
        </teleport>
    </div>
</template>
<script setup>
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import UserPicker from '@/components/common/Forms/UserPicker/UserPicker.vue';
import Modal from '@/components/common/Modal.vue';
import { computed, ref, shallowRef } from 'vue';
import { useStore } from 'vuex';

const modelValue = defineModel({ type: Object });

const store = useStore();

const formIsVisible = shallowRef(false);
const consultants = ref([]);

const targetUsername = computed(() => {
    if (!consultants.value.length) return '-';

    const consultant = consultants.value.find(
        user => Number(user.id) === Number(modelValue.value.id)
    );
    if (consultant) return consultant.userProfile.medium_name;

    return '-';
});

const value = computed({
    get() {
        return modelValue.value?.id;
    },
    set(value) {
        if (value)
            modelValue.value = {
                id: value,
                chat_member_id: consultants.value.find(user => Number(user.id) === Number(value))
                    .chat_member_id
            };
        else modelValue.value = null;
    }
});

const fetchConsultants = async () => {
    consultants.value = await store.dispatch('getConsultants');
};

fetchConsultants();
</script>

<template>
    <DashboardChip @click="formIsVisible = true" class="dashboard-page__switch">
        {{ modelValue ? targetUsername : 'Общее' }}
    </DashboardChip>
    <teleport to="body">
        <Modal @close="formIsVisible = false" :show="formIsVisible" title="Выбор сотрудника">
            <UserPicker v-model="value" single :users="consultants" />
        </Modal>
    </teleport>
</template>
<script setup>
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import UserPicker from '@/components/common/Forms/UserPicker/UserPicker.vue';
import Modal from '@/components/common/Modal.vue';
import { computed, ref, shallowRef } from 'vue';
import { useStore } from 'vuex';

const modelValue = defineModel({ type: Object, required: true });

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

<template>
    <DashboardChip @click="formIsVisible = true" class="dashboard-page__switch">
        {{ modelValue ? targetUsername : 'Общее' }}
    </DashboardChip>
    <teleport v-if="formIsVisible" to="body">
        <Modal @close="formIsVisible = false" title="Выбор сотрудника">
            <UserPicker v-model="value" single :users="consultants" />
        </Modal>
    </teleport>
</template>
<script>
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import UserPicker from '@/components/common/Forms/UserPicker/UserPicker.vue';
import Modal from '@/components/common/Modal.vue';

export default {
    name: 'DashboardTargetUser',
    components: { Modal, UserPicker, DashboardChip },
    emits: ['update:modelValue'],
    props: {
        modelValue: {
            type: [Number, String],
            required: true
        }
    },
    data() {
        return {
            formIsVisible: false,
            consultants: []
        };
    },
    computed: {
        targetUsername() {
            if (!this.consultants.length) return '-';

            return this.consultants.find(user => Number(user.id) === Number(this.modelValue.id))
                .userProfile.medium_name;
        },
        value: {
            get() {
                return this.modelValue?.id;
            },
            set(value) {
                this.$emit(
                    'update:modelValue',
                    value
                        ? {
                              id: value,
                              chat_member_id: this.consultants.find(
                                  user => Number(user.id) === Number(value)
                              ).chat_member_id
                          }
                        : null
                );
            }
        }
    },
    async created() {
        this.consultants = await this.$store.dispatch('getConsultants');
    }
};
</script>

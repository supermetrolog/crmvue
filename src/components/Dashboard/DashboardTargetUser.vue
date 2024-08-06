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

            const consultant = this.consultants.find(
                user => Number(user.id) === Number(this.modelValue.id)
            );

            if (consultant) return consultant.userProfile.medium_name;
            return '-';
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

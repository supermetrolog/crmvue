<template>
    <Modal @close="close" :show="opened" width="800" title="Изменение статуса задачи">
        <div class="form-modal-task-status mb-4">
            <RadioIcon
                v-for="(status, value) in statusOptions"
                :key="value"
                v-model="currentStatus"
                :label="status.label"
                :icon="status.icon"
                :class="status.className"
                :value="Number(value)"
            />
        </div>
        <div class="row justify-content-center">
            <MessengerButton
                @click="submit"
                :disabled="submitIsDisabled"
                class="mx-1"
                color="success"
            >
                Сохранить
            </MessengerButton>
            <MessengerButton @click="close" class="mx-1" color="danger">Отменить</MessengerButton>
        </div>
    </Modal>
</template>
<script>
import Modal from '@/components/common/Modal.vue';
import { AsyncModalMixin } from '@/components/common/mixins';
import RadioIcon from '@/components/common/Forms/RadioIcon.vue';
import MessengerButton from '@/components/Messenger/MessengerButton.vue';
export default {
    name: 'FormModalTaskStatus',
    components: {
        MessengerButton,
        RadioIcon,
        Modal
    },
    mixins: [AsyncModalMixin],
    data() {
        return {
            currentStatus: 1,
            statusOptions: {
                1: {
                    label: 'Новая',
                    icon: 'fa-solid fa-plus',
                    className: 'dashboard-bg-primary'
                },
                2: {
                    label: 'В процессе',
                    icon: 'fa-solid fa-hourglass-half',
                    className: 'dashboard-bg-warning'
                },
                3: {
                    label: 'Выполнено',
                    icon: 'fa-solid fa-circle-check',
                    className: 'dashboard-bg-success'
                },
                4: {
                    label: 'Отложено',
                    icon: 'fa-solid fa-pause',
                    className: 'dashboard-bg-danger'
                }
            }
        };
    },
    computed: {
        submitIsDisabled() {
            return this.currentStatus === 1 || this.currentStatus === this.promiseProps?.status;
        }
    },
    watch: {
        opened(newValue) {
            if (newValue) this.currentStatus = this.promiseProps.status;
            else this.currentStatus = 1;
        }
    },
    methods: {
        submit() {
            this.resolve({
                status: this.currentStatus
            });
        }
    }
};
</script>

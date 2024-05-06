<template>
    <div class="messenger-chat">
        <MessengerChatLoader v-if="isLoading" />
        <template v-else-if="currentPanel && currentChat">
            <MessengerChatContent />
            <AnimationTransition :speed="0.8">
                <MessengerQuiz ref="quiz" class="messenger-chat__quiz" />
            </AnimationTransition>
            <AnimationTransition :speed="0.8">
                <MessengerQuizHelper ref="quizHelper" />
            </AnimationTransition>
            <MessengerChatSettings ref="chatSettings" />
        </template>
        <MessengerChatEmpty v-else />
        <teleport to="body">
            <MessengerSchedule ref="schedule" />
            <FormModalTask ref="taskCreator" />
            <FormModalTaskStatus ref="taskStatusEditor" />
            <FormModalMessageNotification ref="notificationCreator" />
            <FormModalMessageReminder ref="reminderCreator" />
            <FormModalMessage ref="messageUpdate" />
        </teleport>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import { LoaderMixin } from '@/components/Messenger/loader.mixin';
import MessengerChatLoader from '@/components/Messenger/Chat/MessengerChatLoader.vue';
import MessengerChatContent from '@/components/Messenger/Chat/MessengerChatContent.vue';
import MessengerChatEmpty from '@/components/Messenger/Chat/MessengerChatEmpty.vue';
import MessengerQuiz from '@/components/Messenger/Quiz/MessengerQuiz.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import MessengerSchedule from '@/components/Messenger/Schedule/MessengerSchedule.vue';
import MessengerQuizHelper from '@/components/Messenger/Quiz/MessengerQuizHelper.vue';
import MessengerChatSettings from '@/components/Messenger/Chat/Settings/MessengerChatSettings.vue';
import FormModalTask from '@/components/Forms/FormModalTask.vue';
import FormModalMessageNotification from '@/components/Forms/FormModalMessageNotification.vue';
import FormModalMessageReminder from '@/components/Forms/FormModalMessageReminder.vue';
import FormModalMessage from '@/components/Forms/FormModalMessage.vue';
import FormModalTaskStatus from '@/components/Forms/FormModalTaskStatus.vue';
import api from '@/api/api.js';

export default {
    name: 'MessengerChat',
    components: {
        FormModalTaskStatus,
        FormModalMessage,
        FormModalMessageReminder,
        FormModalMessageNotification,
        FormModalTask,
        MessengerChatSettings,
        MessengerQuizHelper,
        MessengerSchedule,
        AnimationTransition,
        MessengerQuiz,
        MessengerChatEmpty,
        MessengerChatContent,
        MessengerChatLoader
    },
    mixins: [LoaderMixin],
    provide() {
        return {
            $openSchedule: async () => this.$refs.schedule.open(),
            $toggleQuiz: () => this.$refs.quiz.toggle(),
            $toggleQuizHelper: () => this.$refs.quizHelper.toggle(),
            $toggleSettings: () => this.$refs.chatSettings.toggle(),
            $createReminder: this.createReminder,
            $editReminder: this.editReminder,
            $createNotification: this.createNotification,
            $editNotification: this.editNotification,
            $createTask: this.createTask,
            $editTask: this.editTask,
            $editTaskStatus: this.editTaskStatus,
            $messageUpdate: props => this.$refs.messageUpdate.open(props)
        };
    },
    computed: {
        ...mapState({
            originalLoader: state => state.Messenger.loadingChat,
            currentChat: state => state.Messenger.currentChat,
            currentPanel: state => state.Messenger.currentPanel
        })
    },
    methods: {
        async createReminder(messageID) {
            const response = await this.$refs.reminderCreator.open();

            if (response) {
                this.$store.dispatch('Messenger/addReminder', {
                    messageID: messageID,
                    options: response
                });
                this.$toast('Напоминание успешно создано!');
            }
        },
        async createTask(messageID) {
            const taskResponse = await this.$refs.taskCreator.open();
            if (!taskResponse) return;

            const response = await this.$store.dispatch('Messenger/addTask', {
                messageID: messageID,
                options: taskResponse
            });

            if (response) {
                this.$toast('Задача успешно создана!');
            } else {
                this.$toast('Произошла ошибка. Попробуйте позже');
            }
        },
        async createNotification(messageID) {
            const response = await this.$refs.notificationCreator.open();

            if (response) {
                this.$store.dispatch('Messenger/addNotification', {
                    messageID: messageID,
                    users: response
                });
                this.$toast('Уведомление успешно создано!');
            }
        },
        async editTask(messageID, task) {
            const response = await this.$refs.taskCreator.open(task);

            if (response) {
                this.$store.dispatch('Messenger/updateTask', {
                    messageID,
                    taskID: task.id,
                    payload: {
                        message: response.message,
                        user_id: response.user_id,
                        status: 1
                    }
                });

                this.$toast('Задача успешно изменена.');
            }
        },
        async editTaskStatus(messageID, task) {
            const response = await this.$refs.taskStatusEditor.open(task);

            if (response) {
                const statusUpdated = api.task.changeStatus(task.id, response.status);

                if (statusUpdated) {
                    task.status = response.status;
                    this.$toast('Статус задачи успешно изменен.');
                }
            }
        },
        async editReminder(reminder) {
            const response = await this.$refs.reminderCreator.open(reminder);

            if (response) {
                this.$store.dispatch('Messenger/updateAddition', {
                    ...reminder,
                    ...response
                });

                this.$toast('Напоминание успешно изменено.');
            }
        },
        async editNotification(notification) {
            const response = await this.$refs.notificationCreator.open(notification);

            if (response) {
                this.$store.dispatch('Messenger/updateAddition', {
                    ...notification,
                    ...response
                });

                this.$toast('Уведомление успешно изменено.');
            }
        }
    }
};
</script>

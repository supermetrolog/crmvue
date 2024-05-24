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
            <FormModalMessageAlert ref="alertCreator" />
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
import FormModalMessageAlert from '@/components/Forms/FormModalMessageAlert.vue';
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
        FormModalMessageAlert,
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
            $createAddition: this.createAddition,
            $editAddition: this.editAddition,
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
        async createAddition({ messageID, additionType, successMessage, errorMessage = null }) {
            const creatorResponse = await this.$refs[additionType + 'Creator'].open();
            if (!creatorResponse) return;

            const response = await this.$store.dispatch(
                'Messenger/add' + this.$formatter.text().ucFirst(additionType),
                {
                    messageID,
                    options: creatorResponse
                }
            );

            if (response) this.$toast(successMessage);
            else this.$toast(errorMessage ?? 'Произошла ошибка. Попробуйте позже');
        },
        async editAddition({
            messageID,
            addition,
            additionType,
            successMessage,
            errorMessage = null
        }) {
            const creatorResponse = await this.$refs[additionType + 'Creator'].open(addition);
            if (!creatorResponse) return;

            const response = this.$store.dispatch('Messenger/updateAddition', {
                messageID,
                additionID: addition.id,
                additionType,
                payload: creatorResponse
            });

            if (response) this.$toast(successMessage);
            else this.$toast(errorMessage ?? 'Произошла ошибка. Попробуйте позже');
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
        }
    }
};
</script>

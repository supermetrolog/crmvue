<template>
    <div class="messenger-panel__content">
        <div class="messenger-panel__section messenger-panel-section">
            <div v-if="user" class="messenger-panel-section__list">
                <MessengerPanelProfile @edit="formIsVisible = true" :user="user" />
            </div>
            <EmptyData v-else no-rounded>Данные о сотруднике не найдены..</EmptyData>
        </div>
        <Teleport to="body">
            <FormUser
                v-if="formIsVisible"
                @close="formIsVisible = false"
                @updated="onUserUpdated"
                :form-data="user"
            />
        </Teleport>
    </div>
</template>
<script setup>
import { useStore } from 'vuex';
import EmptyData from '@/components/common/EmptyData.vue';
import { computed, shallowRef } from 'vue';
import FormUser from '@/components/Forms/FormUser.vue';
import MessengerPanelProfile from '@/components/Messenger/Panel/Profile/MessengerPanelProfile.vue';

const store = useStore();

const formIsVisible = shallowRef(false);

const user = computed(() => store.state.Messenger.currentPanel);

const onUserUpdated = async () => {
    await store.dispatch('Messenger/updatePanel');
};
</script>

<template>
    <div class="messenger-chat-header-object">
        <div class="messenger-chat-header__preview">
            <LazyImage :src="dialog.model.object.thumb" alt="chat preview" />
            <span class="messenger-chat-header__id messenger-chat-header-object__id">
                ID{{ dialog.model.object.id }}
            </span>
        </div>
        <div class="messenger-chat-header__description">
            <div class="messenger-chat-header__info">
                <Avatar
                    v-if="dialog.model.object.consultant"
                    :size="35"
                    :label="`${dialog.model.object.consultant.userProfile.medium_name} - консультант`"
                    :src="dialog.model.object.consultant.userProfile.avatar"
                    class="messenger-chat-header__consultant"
                />
                <div>
                    <p class="messenger-chat-header__title">{{ companyName }}</p>
                    <MessengerDialogObjectDealType
                        :type="dialog.model.type"
                        :offers="dialog.model.object.offers"
                    />
                </div>
            </div>
            <p class="messenger-chat-header__address">
                <i class="fa-solid fa-earth-americas mr-1" />
                <span>{{ dialog.model.object.address }}</span>
            </p>
        </div>
    </div>
</template>
<script setup>
import { useStore } from 'vuex';
import { computed } from 'vue';
import { getCompanyName } from '@/utils/formatters/models/company.js';
import LazyImage from '@/components/common/LazyImage.vue';
import Avatar from '@/components/common/Avatar.vue';
import MessengerDialogObjectDealType from '@/components/Messenger/Dialog/Object/MessengerDialogObjectDealType.vue';

const props = defineProps({
    dialog: {
        type: Object,
        required: true
    }
});

const store = useStore();

const company = computed(() => store.state.Messenger.currentPanel);

const companyName = computed(() =>
    getCompanyName(company.value, props.dialog.model.object.company_id)
);
</script>

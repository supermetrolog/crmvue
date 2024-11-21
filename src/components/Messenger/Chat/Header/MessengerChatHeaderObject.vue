<template>
    <div class="messenger-chat-header-object">
        <div class="messenger-chat-header__preview">
            <LazyImage :src="dialog.model.object.thumb" alt="chat preview" />
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
                    <p class="messenger-chat-header__title">
                        <span> от {{ companyName }} </span>
                        <span class="messenger-chat-header__id"
                            >, ID{{ dialog.model.object.id }}</span
                        >
                    </p>
                    <p class="messenger-chat-header__deals">{{ dealType }}</p>
                </div>
            </div>
            <p class="messenger-chat-header__address">{{ dialog.model.object.address }}</p>
        </div>
    </div>
</template>
<script setup>
import { useStore } from 'vuex';
import { computed } from 'vue';
import { objectOptions } from '@/const/options/object.options.js';
import { getCompanyName } from '@/utils/formatter.js';
import LazyImage from '@/components/common/LazyImage.vue';
import Avatar from '@/components/common/Avatar.vue';

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

const dealType = computed(() => objectOptions.dealTypeString[props.dialog.model.type]);
</script>

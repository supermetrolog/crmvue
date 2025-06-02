<template>
    <div class="messenger-dialog messenger-dialog-company" :class="{ current: current }">
        <div class="messenger-dialog__body messenger-dialog-company__body">
            <div class="messenger-dialog-company__preview">
                <CompanyLogo
                    :src="model.logo"
                    as="div"
                    class="messenger-dialog-company__image"
                    :company-id="model.id"
                    :size="75"
                />
                <span class="messenger-dialog-company__id">{{ model.id }}</span>
            </div>
            <div class="messenger-dialog-company__description">
                <p v-if="hasUndefinedName" class="messenger-warning">[Нет уникального названия]</p>
                <p class="messenger-dialog-company__company" :class="{ passive: isPassive }">
                    <i
                        v-if="isPassive"
                        v-tippy="'Компания в пассиве'"
                        class="fa-solid fa-ban mr-1"
                    ></i>
                    <i
                        v-if="isWithoutActiveContacts"
                        v-tippy="'Компания без контактов'"
                        class="fa-solid fa-users-slash mr-1"
                    ></i>
                    <i
                        v-if="model.is_individual"
                        v-tippy="'Физ.лицо'"
                        class="fa-solid fa-user-tie mr-1"
                    ></i>
                    <span>{{ companyName }}</span>
                    <Avatar
                        v-if="model.consultant"
                        :size="25"
                        :label="`${model.consultant.userProfile.medium_name} - консультант`"
                        :src="model.consultant.userProfile.avatar"
                        class="messenger-dialog-company__avatar"
                    />
                </p>
                <div class="messenger-dialog-company__text">
                    <p
                        v-if="model.activity_groups.length"
                        class="messenger-dialog-company__category"
                    >
                        {{ activityGroups }}
                    </p>
                    <p v-else class="messenger-warning">- Группа деятельности не заполнена</p>
                    <p
                        v-if="model.activity_profiles.length"
                        class="messenger-dialog-company__category"
                    >
                        {{ activityProfiles }}
                    </p>
                    <p v-else class="messenger-warning">Профиль деятельности не заполнен</p>
                    <p class="mt-1">
                        <span>{{ contactsCountLabel }}, </span>
                        <span>{{ requestsCountLabel }}, </span>
                        <span>{{ objectsCountLabel }}</span>
                    </p>
                </div>
            </div>
        </div>
        <div v-if="!short" class="messenger-dialog__footer">
            <MessengerDialogPhone
                @click.stop="$emit('update-call')"
                :last-call="lastCall"
                :updated-at="model.updated_at || model.created_at"
                :disabled="isDisabled"
            />
            <MessengerDialogFunctions v-if="statistic" :counts="statistic" />
        </div>
        <MessengerDialogLastMessage v-if="lastMessage" :last-message />
    </div>
</template>
<script setup>
import MessengerDialogPhone from '@/components/Messenger/Dialog/MessengerDialogPhone.vue';
import MessengerDialogFunctions from '@/components/Messenger/Dialog/MessengerDialogFunctions.vue';
import { computed } from 'vue';
import CompanyLogo from '@/components/Company/CompanyLogo.vue';
import { alg } from '@/utils/alg.js';
import { getCompanyName } from '@/utils/formatters/models/company.js';
import { useAuth } from '@/composables/useAuth.js';
import { plural } from '@/utils/plural.js';
import { companyOptions } from '@/const/options/company.options.js';
import Avatar from '@/components/common/Avatar.vue';
import MessengerDialogLastMessage from '@/components/Messenger/Dialog/MessengerDialogLastMessage.vue';

defineEmits(['update-call']);
const props = defineProps({
    model: {
        type: Object,
        required: true
    },
    current: Boolean,
    lastCall: Object,
    statistic: Object,
    lastMessage: Object,
    short: Boolean
});

const { currentUserId } = useAuth();

const isPassive = computed(() => !props.model.status);
const isDisabled = computed(() => props.model.consultant_id !== currentUserId.value);
const isWithoutActiveContacts = computed(() => props.model.active_contacts_count === 0);

const hasUndefinedName = computed(() => {
    return (
        (props.model.noName && !props.model.is_individual) ||
        ((!props.model.nameRu ||
            (alg.isNumeric(props.model.nameRu) && Number(props.model.nameRu) === props.model.id)) &&
            !props.model.nameEng)
    );
});

const companyName = computed(() => getCompanyName(props.model));

const contactsCountLabel = computed(() =>
    plural(props.model.active_contacts_count, '%d контакт', '%d контакта', '%d контактов')
);

const requestsCountLabel = computed(() =>
    plural(props.model.active_requests_count, '%d запрос', '%d запроса', '%d запросов')
);

const objectsCountLabel = computed(() =>
    plural(props.model.objects_count, '%d объект', '%d объекта', '%d объектов')
);

const activityGroups = computed(() => {
    return props.model.activity_groups
        .map(el => companyOptions.activityGroup[el.activity_group_id])
        .join(', ');
});

const activityProfiles = computed(() => {
    return props.model.activity_profiles
        .map(el => companyOptions.activityProfile[el.activity_profile_id])
        .join(', ');
});
</script>

<template>
    <div class="messenger-panel-company">
        <div class="messenger-panel-company__card">
            <div class="messenger-panel-company__actions">
                <UiDropdownActions>
                    <template #trigger>
                        <UiButtonIcon
                            icon="fa-solid fa-ellipsis-vertical"
                            label="Действия над компанией"
                            small
                        />
                    </template>
                    <template #menu>
                        <UiDropdownActionsButton
                            @handle="$emit('edit')"
                            label="Редактировать"
                            icon="fa-solid fa-pen"
                        />
                        <UiDropdownActionsButton
                            v-if="isPassive"
                            @handle="$emit('enable')"
                            label="Восстановить компанию"
                            icon="fa-solid fa-undo"
                        />
                        <UiDropdownActionsButton
                            v-else
                            @handle="$emit('disable')"
                            label="Отправить в архив"
                            icon="fa-solid fa-ban text-danger"
                        />
                        <UiDropdownActionsButton
                            @handle="toChat"
                            label="Перейти в чат компании"
                            icon="fa-solid fa-comment"
                        />
                        <UiDropdownActionsButton
                            @handle="logoFormIsVisible = true"
                            label="Изменить логотип"
                            icon="fa-solid fa-image"
                        />
                    </template>
                </UiDropdownActions>
            </div>
            <div class="messenger-panel-company__header">
                <CompanyLogo
                    v-tippy="'Нажмите, чтобы изменить логотип'"
                    @click="logoFormIsVisible = true"
                    as="div"
                    class="messenger-panel-company__logo"
                    :company-id="company.id"
                    :src="updatedLogo?.src ?? company.logo?.src"
                    :size="60"
                />
                <div>
                    <a
                        :href="'/companies/' + company.id"
                        target="_blank"
                        class="messenger-panel-company__name"
                        :class="{ passive: isPassive }"
                    >
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
                        <span
                            v-if="hasUndefinedName"
                            class="messenger-warning messenger-warning--animated bold"
                        >
                            НЕТ УНИКАЛЬНОГО НАЗВАНИЯ
                        </span>
                        <template v-else>
                            <i
                                v-if="company.is_individual"
                                v-tippy="'Физ.лицо'"
                                class="fa-solid fa-user-tie mr-1"
                            />
                            <span>{{ companyName }}</span>
                        </template>
                    </a>
                    <div class="messenger-panel-company__subtitle">
                        <span>ID{{ company.id }} | </span>
                        <Rating
                            class="messenger-panel-company__rating"
                            :rating="company.rating"
                            :max="3"
                            color="yellow"
                        />
                        <span>|</span>
                        <Avatar
                            v-if="company.consultant"
                            :size="30"
                            :label="`${company.consultant.userProfile.medium_name} - консультант компании`"
                            :src="company.consultant.userProfile.avatar"
                            class="messenger-panel-company__avatar"
                        />
                    </div>
                </div>
            </div>
            <p v-if="website" class="messenger-panel-company__site">
                <span>Сайт: </span>
                <a :href="website" target="_blank" class="link">
                    {{ website }}
                </a>
            </p>
            <p
                v-else
                class="messenger-panel-company__site messenger-warning messenger-warning--animated"
            >
                Сайт: не заполнен
            </p>
            <ul class="messenger-panel-company__options">
                <li v-if="company.activity_groups?.length" class="messenger-panel-company__option">
                    <span>- {{ activityGroups }}</span>
                </li>
                <li v-else class="messenger-panel-company__option">
                    <span class="messenger-warning messenger-warning--animated"
                        >- Группа деятельности не заполнена</span
                    >
                </li>
                <li
                    v-if="company.activity_profiles?.length"
                    class="messenger-panel-company__option"
                >
                    <span>- {{ activityProfiles }}</span>
                </li>
                <li v-else class="messenger-panel-company__option">
                    <span class="messenger-warning messenger-warning--animated"
                        >- Профиль деятельности не заполнен</span
                    >
                </li>
                <template v-if="company.show_product_ranges">
                    <li
                        v-if="company.productRanges?.length"
                        class="messenger-panel-company__option"
                    >
                        <span>- {{ productRanges }}</span>
                    </li>
                    <li v-else class="messenger-panel-company__option">
                        <span class="messenger-warning messenger-warning--animated">
                            - Номенклатура товара не заполнена
                        </span>
                    </li>
                </template>
            </ul>
        </div>
        <MessengerPanelCompanyTabs :key="company.id" :company="company" />
        <teleport to="body">
            <Modal
                @close="closeForm"
                :show="logoFormIsVisible"
                :close-on-outside-click="!logoEdited"
                :close-on-press-esc="!logoEdited"
                :min-height="200"
                title="Обновление логотипа"
                width="800"
            >
                <FormCompanyLogo
                    @updated="onUpdateLogo"
                    @deleted="onDeleteLogo"
                    @canceled="closeForm"
                    @edited="logoEdited = true"
                    :company="company"
                />
            </Modal>
        </teleport>
    </div>
</template>
<script setup>
import Rating from '@/components/common/Rating.vue';
import MessengerPanelCompanyTabs from '@/components/Messenger/Panel/Company/MessengerPanelCompanyTabs.vue';
import { computed, ref } from 'vue';
import { getCompanyName } from '@/utils/formatters/models/company.js';
import { toCorrectUrl, ucFirst } from '@/utils/formatters/string.js';
import { companyOptions } from '@/const/options/company.options.js';
import { alg } from '@/utils/alg.js';
import { useMessenger } from '@/components/Messenger/useMessenger.js';
import { messenger } from '@/const/messenger.js';
import CompanyLogo from '@/components/Company/CompanyLogo.vue';
import Modal from '@/components/common/Modal.vue';
import { useStore } from 'vuex';
import { useNotify } from '@/utils/use/useNotify.js';
import FormCompanyLogo from '@/components/Forms/Company/FormCompanyLogo.vue';
import Avatar from '@/components/common/Avatar.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import UiDropdownActions from '@/components/common/UI/UiDropdownActions.vue';
import UiDropdownActionsButton from '@/components/common/UI/UiDropdownActionsButton.vue';

defineEmits(['edit', 'disable', 'enable']);
const props = defineProps({
    company: {
        type: Object,
        required: true
    }
});

const { openChat } = useMessenger();
const store = useStore();
const notify = useNotify();

const updatedLogo = ref(null);
const logoFormIsVisible = ref(false);
const logoEdited = ref(false);

const hasUndefinedName = computed(() => {
    return (
        (props.company.noName && !props.company.is_individual) ||
        ((!props.company.nameRu ||
            (alg.isNumeric(props.company.nameRu) &&
                Number(props.company.nameRu) === props.company.id)) &&
            !props.company.nameEng)
    );
});

const website = computed(() => {
    if (!props.company.generalContact) return null;

    return props.company.generalContact.websites.length
        ? toCorrectUrl(props.company.generalContact.websites[0].website)
        : null;
});

const activityGroups = computed(() => {
    return props.company.activity_groups
        .map(el => companyOptions.activityGroup[el.activity_group_id])
        .join(', ');
});

const activityProfiles = computed(() => {
    return props.company.activity_profiles
        .map(el => companyOptions.activityProfile[el.activity_profile_id])
        .join(', ');
});

const productRanges = computed(() => {
    return props.company.productRanges.map(element => ucFirst(element.product)).join(', ');
});

const companyName = computed(() => getCompanyName(props.company, props.company.id));

const isPassive = computed(() => !props.company.status);
const isWithoutActiveContacts = computed(() => props.company.active_contacts_count === 0);

const toChat = () => {
    openChat(props.company.id, props.company.id, messenger.dialogTypes.COMPANY);
};

const closeForm = () => {
    logoFormIsVisible.value = false;
    logoEdited.value = false;
};

const onUpdateLogo = logo => {
    closeForm();

    notify.success('Логотип компании обновлен');
    store.commit('Messenger/onCompanyLogoUpdated', { id: props.company.id, logo });
};

const onDeleteLogo = () => {
    closeForm();

    notify.success('Логотип компании удален');
    store.commit('Messenger/onCompanyLogoUpdated', { id: props.company.id });
};
</script>

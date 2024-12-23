<template>
    <div class="messenger-panel-company">
        <div class="messenger-panel-company__card">
            <div class="messenger-panel-company__actions">
                <HoverActionsButton
                    @click="$emit('edit')"
                    label="Редактировать компанию"
                    class="messenger-panel-company__action"
                    small
                >
                    <i class="fa-solid fa-pen"></i>
                </HoverActionsButton>
                <HoverActionsButton
                    @click="toChat"
                    label="Перейти в чат компании"
                    class="messenger-panel-company__action"
                    small
                >
                    <i class="fa-solid fa-comment"></i>
                </HoverActionsButton>
                <HoverActionsButton
                    @click="onCompanyDestroyed"
                    label="Компания ликвидирована"
                    class="messenger-panel-company__action dashboard-bg-danger-l"
                    small
                >
                    <i class="fa-solid fa-ban"></i>
                </HoverActionsButton>
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
                        <span v-if="hasUndefinedName" class="messenger-warning bold">
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
            <p v-else class="messenger-panel-company__site messenger-warning bold">
                Сайт: не заполнен
            </p>
            <ul class="messenger-panel-company__options">
                <li v-if="activityGroup" class="messenger-panel-company__option">
                    <span>- {{ activityGroup }}</span>
                </li>
                <li v-else class="messenger-panel-company__option">
                    <span class="messenger-warning">- Группа деятельности не заполнена</span>
                </li>
                <li v-if="activityProfile" class="messenger-panel-company__option">
                    <span>- {{ activityProfile }}</span>
                </li>
                <li v-else class="messenger-panel-company__option">
                    <span class="messenger-warning">- Профиль деятельности не заполнен</span>
                </li>
                <li v-if="productRanges" class="messenger-panel-company__option">
                    <span>- {{ productRanges }}</span>
                </li>
                <li v-else class="messenger-panel-company__option">
                    <span class="messenger-warning">- Номенклатура товара не заполнена</span>
                </li>
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
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import { computed, ref } from 'vue';
import { getCompanyName, getCompanyShortName } from '@/utils/formatters/models/company.js';
import { toCorrectUrl, ucFirst } from '@/utils/formatters/string.js';
import { companyOptions } from '@/const/options/company.options.js';
import { contactOptions } from '@/const/options/contact.options.js';
import { alg } from '@/utils/alg.js';
import { useMessenger } from '@/components/Messenger/useMessenger.js';
import { messenger } from '@/const/messenger.js';
import CompanyLogo from '@/components/Company/CompanyLogo.vue';
import Modal from '@/components/common/Modal.vue';
import { useStore } from 'vuex';
import { useNotify } from '@/utils/use/useNotify.js';
import FormCompanyLogo from '@/components/Forms/Company/FormCompanyLogo.vue';
import Avatar from '@/components/common/Avatar.vue';
import { TASK_FORM_STEPS, useTaskManager } from '@/composables/useTaskManager.js';
import api from '@/api/api.js';

defineEmits(['edit']);
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
    const generalContact = props.company.contacts.find(
        contact => contact.type === contactOptions.typeStatement.GENERAL
    );

    if (generalContact && generalContact.websites.length) {
        return toCorrectUrl(generalContact.websites[0].website);
    }

    return null;
});
const activityGroup = computed(() => {
    return companyOptions.activityGroup[props.company.activityGroup];
});
const activityProfile = computed(() => {
    return companyOptions.activityProfile[props.company.activityProfile];
});
const productRanges = computed(() => {
    return props.company.productRanges.map(element => ucFirst(element.product)).join(', ');
});

const companyName = computed(() => getCompanyName(props.company, props.company.id));

const isPassive = computed(() => !props.company.status);

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

const { createTaskWithTemplate } = useTaskManager();

async function onCompanyDestroyed() {
    const company = store.state.Messenger.currentPanel;

    const taskPayload = await createTaskWithTemplate({
        message: `Компания ${getCompanyShortName(company)} ликвидирована, отправить в пассив`,
        step: TASK_FORM_STEPS.MESSAGE
    });

    if (!taskPayload) return;

    const messagePayload = {
        message: `<b>Компания ликвидирована!</b>`
    };

    const currentCompanyDialogId = await api.messenger.getChatMemberIdByQuery({
        model_type: messenger.dialogTypes.COMPANY,
        model_id: company.id
    });

    const createdMessage = await api.messenger.sendMessageWithTask(
        currentCompanyDialogId,
        messagePayload,
        taskPayload
    );

    if (createdMessage) {
        notify.success('Сообщение и задача успешно созданы');
    } else {
        notify.error('Произошла ошибка. Попробуйте еще раз..');
    }
}
</script>

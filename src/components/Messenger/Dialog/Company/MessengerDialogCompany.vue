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
                <span class="messenger-dialog-company__id">ID{{ model.id }}</span>
                <Avatar
                    v-if="model.consultant"
                    :size="30"
                    :label="`${model.consultant.userProfile.medium_name} - консультант`"
                    :src="model.consultant.userProfile.avatar"
                    class="messenger-dialog__avatar messenger-dialog-company__avatar"
                />
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
                </p>
                <div class="messenger-dialog-company__categories mt-1">
                    <DashboardChip
                        v-for="category in categories"
                        :key="category.id"
                        class="dashboard-bg-gray-l messenger-dialog-company__category"
                    >
                        {{ category.label }}
                    </DashboardChip>
                </div>
                <p class="messenger-dialog-company__address mt-1">
                    <Tooltip
                        v-if="model.office_address"
                        :text="model.office_address"
                        icon="fa-solid fa-earth-americas"
                    />
                    <span v-if="model.office_address">{{ model.office_address }}</span>
                    <span v-else class="messenger-warning">Адрес офиса не заполнен</span>
                </p>
            </div>
        </div>
        <div class="messenger-dialog__footer">
            <MessengerDialogPhone
                @click.stop="$emit('update-call')"
                :last-call="lastCall"
                :updated-at="model.updated_at"
                :disabled="isDisabled"
            />
            <MessengerDialogFunctions v-if="statistic" :counts="statistic" />
        </div>
    </div>
</template>
<script setup>
import MessengerDialogPhone from '@/components/Messenger/Dialog/MessengerDialogPhone.vue';
import MessengerDialogFunctions from '@/components/Messenger/Dialog/MessengerDialogFunctions.vue';
import Tooltip from '@/components/common/Tooltip.vue';
import { computed } from 'vue';
import CompanyLogo from '@/components/Company/CompanyLogo.vue';
import { alg } from '@/utils/alg.js';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { CompanyCategories } from '@/const/const.js';
import Avatar from '@/components/common/Avatar.vue';
import { getCompanyName } from '@/utils/formatters/models/company.js';
import { useAuth } from '@/composables/useAuth.js';

defineEmits(['update-call']);
const props = defineProps({
    model: {
        type: Object,
        required: true
    },
    current: {
        type: Boolean,
        default: false
    },
    lastCall: {
        type: Object,
        default: null
    },
    statistic: {
        type: Object,
        default: null
    }
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

const categories = computed(() => {
    return props.model.categories.map(element => {
        return {
            id: element.id,
            label: CompanyCategories[element.category]
        };
    });
});
</script>

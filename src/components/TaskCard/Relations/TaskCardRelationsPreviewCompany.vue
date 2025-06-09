<template>
    <div class="task-card-relation-company messenger-dialog-company position-relative">
        <div class="messenger-dialog__body messenger-dialog-company__body">
            <div class="messenger-dialog-company__preview">
                <CompanyLogo
                    :src="company.logo"
                    as="div"
                    class="messenger-dialog-company__image"
                    :company-id="company.id"
                    :size="75"
                />
                <span class="messenger-dialog-company__id">{{ company.id }}</span>
            </div>
            <div class="messenger-dialog-company__description">
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
                        v-if="company.is_individual"
                        v-tippy="'Физ.лицо'"
                        class="fa-solid fa-user-tie mr-1"
                    ></i>
                    <span>{{ companyName }}</span>
                    <Avatar
                        v-if="company.consultant"
                        :size="25"
                        :label="`${company.consultant.userProfile.medium_name} - консультант`"
                        :src="company.consultant.userProfile.avatar"
                        class="messenger-dialog-company__avatar"
                    />
                </p>
                <div class="messenger-dialog-company__text">
                    <p
                        v-if="company.activity_groups.length"
                        class="messenger-dialog-company__category"
                    >
                        {{ activityGroups }}
                    </p>
                    <p v-else class="messenger-warning">- Группа деятельности не заполнена</p>
                    <p
                        v-if="company.activity_profiles.length"
                        class="messenger-dialog-company__category"
                    >
                        {{ activityProfiles }}
                    </p>
                    <p v-else class="messenger-warning">Профиль деятельности не заполнен</p>
                </div>
            </div>
            <UiDropdownActions
                class="task-card-relation__dropdown"
                menu-class="task-card__dropdown"
            >
                <template #trigger>
                    <UiButtonIcon
                        class="dashboard-bg-primary-l"
                        small
                        label="Подробнее"
                        icon="fa-solid fa-ellipsis"
                    />
                </template>
                <template #menu>
                    <UiDropdownActionsButton
                        @handle="$emit('unlink')"
                        label="Удалить связь"
                        icon="fa-solid fa-link-slash"
                    />
                    <UiDropdownActionsButton
                        @handle="$emit('to-company')"
                        label="Просмотреть компанию"
                        icon="fa-solid fa-arrow-up-right-from-square"
                    />
                    <UiDropdownActionsButton
                        @handle="$emit('show-contacts')"
                        label="Список контактов"
                        icon="fa-solid fa-contact-card"
                    />
                </template>
            </UiDropdownActions>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import CompanyLogo from '@/components/Company/CompanyLogo.vue';
import { getCompanyName } from '@/utils/formatters/models/company.js';
import { companyOptions } from '@/const/options/company.options.js';
import Avatar from '@/components/common/Avatar.vue';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import UiDropdownActions from '@/components/common/UI/DropdownActions/UiDropdownActions.vue';

defineEmits(['unlink', 'to-company', 'show-contacts']);
const props = defineProps({
    company: {
        type: Object,
        required: true
    }
});

const isPassive = computed(() => !props.company.status);
const isWithoutActiveContacts = computed(() => props.company.active_contacts_count === 0);

const companyName = computed(() => getCompanyName(props.company));

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
</script>

<template>
    <div class="company-short-card">
        <CompanyLogo
            ref="companyLogoEl"
            @click="$emit('update-logo')"
            :company-id="company.id"
            :src="company.logo?.src"
            :size="logoSize"
            as="div"
            class="company-short-card__logo"
            :class="{ editable: editableLogo }"
        />
        <div>
            <a
                v-if="showName"
                :href="companyUrl"
                target="_blank"
                class="company-short-card__name"
                :class="{ passive: isPassive }"
            >
                <UiTooltipIcon
                    v-if="isPassive"
                    tooltip="Компания в архиве"
                    icon="fa-solid fa-ban"
                    class="mr-1"
                />
                <UiTooltipIcon
                    v-if="isWithoutActiveContacts"
                    tooltip="Компания без активных контактов"
                    icon="fa-solid fa-users-slash"
                    class="mr-1"
                />
                <span v-if="hasUndefinedName" class="company-short-card__warning">
                    НЕТ УНИКАЛЬНОГО НАЗВАНИЯ
                </span>
                <template v-else>
                    <UiTooltipIcon
                        v-if="company.is_individual"
                        tooltip="Физическое лицо"
                        icon="fa-solid fa-user-tie"
                    />
                    <span>{{ companyName }}</span>
                </template>
            </a>
            <div class="d-flex gap-1 align-items-center">
                <span>ID{{ company.id }}</span>
                <span>|</span>
                <CompanyPreviewRating
                    class="company-short-card__rating"
                    :rating="company.rating"
                    :max="3"
                />
                <span>|</span>
                <Avatar
                    v-if="company.consultant"
                    :label="`${company.consultant.userProfile.medium_name} - консультант компании`"
                    :src="company.consultant.userProfile.avatar"
                    :size="avatarSize"
                    class="company-short-card__avatar"
                />
                <template v-if="!showName">
                    <UiTooltipIcon
                        v-if="isPassive"
                        tooltip="Компания в архиве"
                        icon="fa-solid fa-ban"
                        class="mr-1"
                    />
                    <UiTooltipIcon
                        v-if="isWithoutActiveContacts"
                        tooltip="Компания без активных контактов"
                        icon="fa-solid fa-users-slash"
                        class="mr-1"
                    />
                    <UiTooltipIcon
                        v-if="company.is_individual"
                        tooltip="Физическое лицо"
                        icon="fa-solid fa-user-tie"
                    />
                </template>
            </div>
            <div>
                <p v-if="website" class="company-short-card__site">
                    <a :href="website" target="_blank" class="link">
                        {{ website }}
                    </a>
                </p>
                <p v-else class="company-short-card__site company-short-card__warning">
                    Сайт: не заполнен
                </p>
                <ul class="company-short-card__options">
                    <li class="company-short-card__option">
                        <span v-if="company.activity_groups?.length">{{ activityGroups }} </span>
                        <span v-else class="company-short-card__warning">
                            Группа деятельности не заполнена
                        </span>
                    </li>
                    <li class="company-short-card__option">
                        <span v-if="company.activity_profiles?.length">
                            {{ activityProfiles }}
                        </span>
                        <span v-else class="company-short-card__warning">
                            Профиль деятельности не заполнен
                        </span>
                    </li>
                </ul>
            </div>
            <p class="text-grey mt-1">Создана {{ createdAt }}</p>
        </div>
    </div>
</template>
<script setup>
import CompanyLogo from '@/components/Company/CompanyLogo.vue';
import { computed, useTemplateRef } from 'vue';
import { getCompanyShortName } from '@/utils/formatters/models/company.js';
import CompanyPreviewRating from '@/components/Company/Preview/CompanyPreviewRating.vue';
import Avatar from '@/components/common/Avatar.vue';
import { useTippyText } from '@/composables/useTippyText.js';
import UiTooltipIcon from '@/components/common/UI/UiTooltipIcon.vue';
import { alg } from '@/utils/alg.js';
import { toCorrectUrl } from '@/utils/formatters/string.js';
import { companyOptions } from '@/const/options/company.options.js';
import { useRouter } from 'vue-router';
import { toDateFormat } from '@/utils/formatters/date.js';

defineEmits(['update-logo']);
const props = defineProps({
    company: {
        type: Object,
        required: true
    },
    editableLogo: Boolean,
    logoSize: {
        type: Number,
        default: 130
    },
    avatarSize: {
        type: Number,
        default: 30
    },
    showName: {
        type: Boolean,
        default: true
    }
});

const router = useRouter();

const companyUrl = computed(
    () => router.resolve({ name: 'company', params: { id: props.company.id } }).href
);

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

const companyName = computed(() => getCompanyShortName(props.company, props.company.id));

const isPassive = computed(() => !props.company.status);
const isWithoutActiveContacts = computed(() => props.company.active_contacts_count === 0);

const createdAt = computed(() => toDateFormat(props.company.created_at, 'D.MM.YYг.'));

// tippy

if (props.editableLogo) {
    useTippyText(useTemplateRef('companyLogoEl'), 'Нажмите, чтобы редактировать логотип');
}
</script>

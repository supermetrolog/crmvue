<template>
    <div class="equipment" :class="{ passive: isPassive }">
        <div class="equipment__header">
            <span class="equipment__chip">ID - {{ equipment.id }}</span>
            <span class="equipment__chip">{{ category }}</span>
            <div class="equipment__actions">
                <HoverActionsButton @click="$emit('view')" label="Подробнее">
                    <i class="fa-solid fa-eye"></i>
                </HoverActionsButton>
                <HoverActionsButton label="Открыть в PDF" disabled>
                    <i class="fas fa-file-pdf"></i>
                </HoverActionsButton>
                <HoverActionsButton label="Открыть в чате" disabled>
                    <i class="fa-solid fa-comment"></i>
                </HoverActionsButton>
                <template v-if="canEdit">
                    <HoverActionsButton @click="$emit('edit')" label="Редактировать">
                        <i class="fa-solid fa-pen"></i>
                    </HoverActionsButton>
                    <HoverActionsButton
                        @click="$emit('toggle-passive')"
                        :active="isPassive"
                        :label="isPassive ? 'Снять с пассива' : 'Отправить в пассив'"
                    >
                        <i class="fa-solid fa-ban"></i>
                    </HoverActionsButton>
                </template>
                <HoverActionsButton v-if="canRemove" @click="$emit('remove')" label="Удалить">
                    <i class="fa-solid fa-trash"></i>
                </HoverActionsButton>
            </div>
        </div>
        <div class="equipment__body">
            <div class="equipment__aside">
                <div @click="$emit('view')" class="equipment__preview c-pointer">
                    <VLazyImage
                        v-if="equipment.preview"
                        :src="equipment.preview"
                        class="equipment__photo"
                    />
                    <NoImage v-else class="equipment__photo" />
                </div>
            </div>
            <div class="equipment__content">
                <div class="equipment__description">
                    <div class="equipment__badges">
                        <p v-if="equipment.availability === 1" class="equipment__badge">
                            <span class="equipment__badge">В наличии</span>
                            <b v-if="equipment.count">({{ equipment.count }})</b>
                            <span v-if="equipment.state">, {{ usedStatus }}</span>
                        </p>
                        <span v-else-if="equipment.availability === 2" class="equipment__badge">
                            Под заказ
                        </span>
                        <span
                            v-if="equipment.benefit"
                            class="equipment__badge dashboard-bg-success-l"
                        >
                            Выгодное предложение
                        </span>
                    </div>
                    <p @click="$emit('view')" class="equipment__title c-pointer">
                        {{ equipment.name }}
                    </p>
                    <div
                        @click="$emit('view')"
                        class="equipment__description-text c-pointer"
                        v-html="equipment.description"
                    ></div>
                </div>
            </div>
            <div class="equipment__address">
                <p class="equipment__text">Адрес</p>
                <p>{{ equipment.address }}</p>
            </div>
            <div class="equipment__contact">
                <p class="equipment__text">Предлагает</p>
                <CompanyElement v-if="equipment.company" :company="equipment.company" />
                <CompanyContact v-if="equipment.contact" :contact="equipment.contact" />
            </div>
            <div class="equipment__meta">
                <div class="equipment__price">
                    <p class="equipment__price-value d-flex">
                        <span v-if="equipment.price">
                            {{ $formatter.number(equipment.price) }} ₽
                        </span>
                        <span v-else>Цена не указана</span>
                        <span v-if="equipment.tax">, {{ tax }}</span>
                    </p>
                    <p v-if="equipment.delivery" class="equipment__delivery">
                        <i class="fa-solid fa-truck"></i>
                        <span class="ml-1">{{ delivery }}</span>
                    </p>
                </div>
                <div class="equipment__statuses">
                    <p
                        class="equipment__chip equipment__status"
                        :class="{ 'bg-danger': isPassive }"
                    >
                        {{ isPassive ? 'Пассив' : 'Актив' }}
                    </p>
                    <p
                        v-if="equipment.consultant"
                        v-tippy="'Прикрепленный консультант'"
                        class="equipment__badge"
                    >
                        <i class="fa-solid fa-user-tie"></i>
                        <span>{{ equipment.consultant.userProfile.medium_name }}</span>
                    </p>
                    <p v-tippy="'Дата последнего звонка'" class="equipment__badge">
                        <i class="fa-solid fa-phone-volume"></i>
                        <span>{{ lastCallDate }}</span>
                    </p>
                    <p v-tippy="'Дата последнего обновления'" class="equipment__badge">
                        <i class="fa-solid fa-rotate"></i>
                        <span>{{ lastUpdateDate }}</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import VLazyImage from 'v-lazy-image';
import CompanyElement from '@/components/Company/CompanyElement.vue';
import CompanyContact from '@/components/Company/CompanyContact.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import dayjs from 'dayjs';
import NoImage from '@/components/common/NoImage.vue';
import { computed } from 'vue';
import { equipmentOptions } from '@/const/options/equipment.options.js';
import { useStore } from 'vuex';

const store = useStore();

defineEmits(['edit', 'view', 'toggle-passive', 'remove']);
const props = defineProps({
    equipment: {
        type: Object,
        required: true
    }
});

const canRemove = computed(() => store.getters.isModerator);
const canEdit = computed(() => {
    return store.getters.isModerator || props.equipment.created_by_id == store.getters.THIS_USER.id;
});

const usedStatus = computed(() => equipmentOptions.usedStatus[props.equipment.state]);
const category = computed(() => equipmentOptions.category[props.equipment.category]);
const isPassive = computed(
    () => props.equipment.status === equipmentOptions.statusStatement.PASSIVE
);
const tax = computed(() => equipmentOptions.tax[props.equipment.tax]);
const delivery = computed(() => equipmentOptions.delivery[props.equipment.delivery]);

const lastCallDate = computed(() => {
    if (props.equipment.last_call) {
        const date = dayjs(props.equipment.last_call.created_at);

        if (date.isToday()) return date.format('Сегодня, HH:mm');
        else return date.format('DD.MM.YYYY, HH:mm');
    }

    return 'Отсутствует';
});

const lastUpdateDate = computed(() => {
    const dayjsDate = dayjs(props.equipment.updated_at);

    if (dayjsDate.isToday()) return `Сегодня, ${dayjsDate.format('HH:mm')}`;
    if (dayjsDate.isYesterday()) return `Вчера, ${dayjsDate.format('HH:mm')}`;
    return dayjsDate.format('D.MM.YY, HH:mm');
});
</script>

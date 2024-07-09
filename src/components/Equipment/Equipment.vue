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
                <HoverActionsButton @click="$emit('edit')" label="Редактировать">
                    <i class="fa-solid fa-pen"></i>
                </HoverActionsButton>
                <HoverActionsButton
                    @click="togglePassive"
                    :active="isPassive"
                    :label="isPassive ? 'Снять с пассива' : 'Отправить в пассив'"
                >
                    <i class="fa-solid fa-ban"></i>
                </HoverActionsButton>
                <HoverActionsButton @click="remove" label="Удалить">
                    <i class="fa-solid fa-trash"></i>
                </HoverActionsButton>
            </div>
        </div>
        <div class="equipment__body">
            <div class="equipment__aside">
                <div @click="$emit('view')" class="equipment__preview c-pointer">
                    <VLazyImage :src="equipment.preview" class="equipment__photo" />
                </div>
            </div>
            <div class="equipment__content">
                <div class="equipment__description">
                    <div class="equipment__badges">
                        <p class="equipment__badge">
                            <span class="equipment__badge">В наличии</span>
                            <b v-if="equipment.count">({{ equipment.count }})</b>
                            <span>, {{ usedStatus }}</span>
                        </p>
                        <span class="equipment__badge">Под заказ</span>
                    </div>
                    <p @click="$emit('view')" class="equipment__title c-pointer">
                        {{ equipment.name }}
                    </p>
                    <p class="equipment__description">{{ equipment.description }}</p>
                </div>
            </div>
            <div class="equipment__address">
                <p class="equipment__text">Адрес</p>
                <p>
                    Предлагает много текст тут будет Предлагает много текст тут будет Предлагает
                    много текст тут будет
                </p>
                <p>
                    Предлагает много текст тут будет Предлагает много текст тут будет Предлагает
                    много текст тут будет
                </p>
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
                        <span>{{ equipment.consultant.userProfile.short_name }}</span>
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

<script>
import VLazyImage from 'v-lazy-image';
import CompanyElement from '@/components/Company/CompanyElement.vue';
import CompanyContact from '@/components/Company/CompanyContact.vue';
import { entityOptions } from '@/const/options/options.js';
import { unitTypes } from '@/const/unitTypes.js';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import dayjs from 'dayjs';
import { useConfirm } from '@/composables/useConfirm.js';

export default {
    name: 'Equipment',
    components: { HoverActionsButton, CompanyContact, CompanyElement, VLazyImage },
    emits: ['edit', 'view'],
    props: {
        equipment: {
            type: Object,
            required: true
        }
    },
    setup() {
        const { confirm } = useConfirm();
        return { confirm };
    },
    computed: {
        unitTypes() {
            return unitTypes;
        },
        usedStatus() {
            return entityOptions.equipment.usedStatus[this.equipment.used_status];
        },
        category() {
            return entityOptions.equipment.category[this.equipment.category];
        },
        isPassive() {
            return this.equipment.status === 2;
        },
        lastCallDate() {
            if (!this.equipment.lastCall) return 'Неизвестно';
            return dayjs(this.equipment.lastCall).format('DD.MM.YYYY, HH:mm');
        },
        lastUpdateDate() {
            const dayjsDate = dayjs(this.equipment.updated_at);

            if (dayjsDate.isToday()) return `Сегодня, ${dayjsDate.format('HH:mm')}`;
            if (dayjsDate.isYesterday()) return `Вчера, ${dayjsDate.format('HH:mm')}`;
            return dayjsDate.format('D.MM.YY, HH:mm');
        },
        tax() {
            return entityOptions.equipment.tax[this.equipment.tax];
        },
        delivery() {
            return entityOptions.equipment.delivery[this.equipment.delivery];
        }
    },
    methods: {
        async togglePassive() {
            const confirmed = await this.confirm(
                this.isPassive
                    ? 'Вы уверены, что хотите снять объект с пассива?'
                    : 'Вы уверены, что хотите отправить объект в пассив?'
            );

            if (confirmed) {
                this.$notify(
                    this.isPassive ? 'Объект снят с пассива' : 'Объект отправлен в пассив'
                );
            }
        },
        async remove() {
            const confirmed = await this.confirm(
                'Вы уверены, что хотите безвозвратно удалить объект?'
            );

            if (confirmed) {
                this.$notify('Объект успешно удален.');
            }
        }
    }
};
</script>

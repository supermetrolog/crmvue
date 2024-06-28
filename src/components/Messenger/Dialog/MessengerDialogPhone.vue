<template>
    <div class="messenger-dialog__phone" :class="className">
        <Tooltip>
            <template #trigger>
                <span class="messenger-dialog__last-call">от {{ formattedDate }}</span>
            </template>
            <template #content>
                <p>{{ daysFromNowTippy }}</p>
                <p v-if="lastCall">
                    Звонок совершил(а) {{ lastCall.user?.userProfile?.medium_name }}
                </p>
                <p v-else>Дата сформирована на основе последнего обновления объекта/зпроса</p>
            </template>
        </Tooltip>
        <span class="messenger-dialog__icon">
            <i class="fa-solid fa-phone"></i>
        </span>
    </div>
</template>
<script>
import dayjs from 'dayjs';
import plural from 'plural-ru';
import Tooltip from '@/components/common/Tooltip.vue';

export default {
    name: 'MessengerDialogPhone',
    components: { Tooltip },
    props: {
        lastCall: {
            type: Object,
            default: null
        },
        updatedAt: {
            type: [String, Number],
            required: true
        }
    },
    computed: {
        correctDate() {
            if (this.lastCall) return this.lastCall.created_at;
            return this.updatedAt;
        },
        formattedDate() {
            return dayjs(this.correctDate).format('DD.MM.YYYY');
        },
        daysFromNow() {
            return dayjs().diff(dayjs(this.correctDate), 'day');
        },
        daysFromNowTippy() {
            if (this.daysFromNow === 0) return 'Сегодня';
            if (this.daysFromNow === 1) return 'Вчера';
            return plural(this.daysFromNow, '%d день назад', '%d дня назад', '%d дней назад');
        },
        className() {
            const classNameBase = 'messenger-dialog__phone--';

            if (this.daysFromNow >= import.meta.env.VITE_VUE_APP_MESSENGER_DATE_FROM_CALL_DANGER) {
                return classNameBase + 'danger';
            }

            if (this.daysFromNow >= import.meta.env.VITE_VUE_APP_MESSENGER_DATE_FROM_CALL_WARNING) {
                return classNameBase + 'warning';
            }

            if (this.daysFromNow >= import.meta.env.VITE_VUE_APP_MESSENGER_DATE_FROM_CALL_INFO) {
                return classNameBase + 'info';
            }

            return classNameBase + 'success';
        }
    }
};
</script>

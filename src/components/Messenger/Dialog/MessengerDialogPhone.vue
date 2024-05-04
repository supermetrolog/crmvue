<template>
    <div class="messenger-dialog__phone" :class="className">
        <span v-tippy="daysFromNowTippy" class="messenger-dialog__last-call">
            от {{ formattedDate }}
        </span>
        <span v-if="className" class="messenger-dialog__icon">
            <i class="fa-solid fa-phone"></i>
        </span>
    </div>
</template>
<script>
import dayjs from 'dayjs';
import plural from 'plural-ru';

export default {
    name: 'MessengerDialogPhone',
    props: {
        info: {
            type: Object,
            required: true
        }
    },
    computed: {
        formattedDate() {
            return dayjs(this.info.lastCall).format('DD.MM.YYYY');
        },
        daysFromNow() {
            return dayjs().diff(dayjs(this.info.lastCall), 'day');
        },
        daysFromNowTippy() {
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

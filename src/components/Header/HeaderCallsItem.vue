<template>
    <div class="row item no-gutters">
        <div class="col-2 notify-icon text-center">
            <i
                class="fas fa-phone-alt"
                :class="[call_ended_status.iconClass, call_ended_status.icon]"
            ></i>
        </div>
        <div class="col-10 message text-left">
            <p class="title">
                Звонок
                <small class="time">{{ call.created_at }}</small>
            </p>
            <p v-if="call.type == 0" class="text">
                Исходящий звонок на номер
                <PhoneNumber
                    v-if="call.phoneTo"
                    @createdContact="$emit('refreshCallList')"
                    :phone="{ phone: call.to }"
                    :text="`${call.to} (${call.phoneTo.contact.first_and_last_name})`"
                    :contact="call.phoneTo.contact"
                    class="d-inline"
                    class-list="text-center d-inline"
                />
                <!-- <span v-else>{{ call.to }}(нет в базе)</span> -->
                <PhoneNumber
                    v-else
                    @createdContact="$emit('refreshCallList')"
                    :phone="{ phone: call.to }"
                    :text="`${call.to} (нет в базе)`"
                    class="d-inline"
                    class-list="text-center d-inline"
                />
            </p>
            <p v-else-if="call.type == 1" class="text">
                Входящий звонок с номера
                <PhoneNumber
                    v-if="call.phoneFrom"
                    @createdContact="$emit('refreshCallList')"
                    :phone="{ phone: call.from }"
                    :text="`${call.from} (${call.phoneFrom.contact.first_and_last_name})`"
                    :contact="call.phoneFrom.contact"
                    class="d-inline"
                    class-list="text-center d-inline"
                />
                <PhoneNumber
                    v-else
                    @createdContact="$emit('refreshCallList')"
                    :phone="{ phone: call.from }"
                    :text="`${call.from} (нет в базе)`"
                    class="d-inline"
                    class-list="text-center d-inline"
                />
                <!-- <span v-else>{{ call.from }}(нет в базе)</span> -->
            </p>
            <div class="call-status">
                <p class="text">Статус:</p>
                <p class="text ml-1" :class="call_ended_status.class">
                    {{ call_ended_status.text }}
                </p>
            </div>
        </div>
        <span v-if="isNew" class="badge">new</span>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'HeaderCallsItem',
    props: {
        call: {
            type: Object
        },
        isNew: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapGetters(['THIS_USER']),
        call_ended_status() {
            let call_ended_status = {};
            call_ended_status.icon = 'fas fa-reply';
            call_ended_status.iconClass = 'text-success';

            if (this.call.type == 0) {
                call_ended_status.iconClass = 'text-success_alt';
                call_ended_status.icon = 'fas fa-share';
            }
            switch (this.call.call_ended_status) {
                case 'ANSWER':
                    call_ended_status.class = 'text-success';
                    call_ended_status.text = 'вызов принят';
                    // status.icon = "fas fa-phone-volume";
                    break;
                case 'BUSY':
                    call_ended_status.class = 'text-danger';
                    call_ended_status.text = 'вызов сброшен';
                    break;
                case 'CANCEL':
                    call_ended_status.class = 'text-warning';
                    call_ended_status.text = 'вызов отменен';
                    break;
                case 'NOANSWER':
                    call_ended_status.class = 'text-warning';
                    call_ended_status.text = 'абонент не ответил';
                    break;
                case null:
                    call_ended_status.class = 'text-info';
                    call_ended_status.text = 'ожидание ответа';
                    // status.icon = "fas fa-phone-alt";
                    break;
                default:
                    break;
            }
            return call_ended_status;
        }
    }
};
</script>

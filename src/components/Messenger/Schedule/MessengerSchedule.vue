<template>
    <Modal v-if="opened" @close="close" :title="title || 'Выбор даты и времени'">
        <DatePicker v-model="date" @select="select" :markers="markers" />
    </Modal>
</template>
<script>
import Modal from '@/components/common/Modal.vue';
import dayjs from 'dayjs';
import DatePicker from '@/components/common/Forms/DatePicker/DatePicker.vue';

export default {
    name: 'MessengerSchedule',
    components: {
        DatePicker,
        Modal
    },
    data() {
        return {
            opened: false,
            date: null,
            title: null,
            markers: [
                {
                    date: dayjs().add(2, 'day').toDate(),
                    type: 'dot',
                    tooltip: [{ text: 'Tooltip 1' }, { text: 'Tooltip 2' }],
                    color: 'red'
                }
            ]
        };
    },
    methods: {
        open(options = { date: null, title: null }) {
            this.date = options.date;
            this.title = options.title;
            this.markers = [
                {
                    date: dayjs().add(2, 'day').toDate(),
                    type: 'line',
                    tooltip: [
                        { text: 'Tooltip 1', count: 1, type: 1 },
                        { text: 'Tooltip 2', count: 20, type: 2 }
                    ],
                    color: 'red'
                }
            ];

            let resolve, reject;
            const promise = new Promise((ok, fail) => {
                resolve = ok;
                reject = fail;
            });

            this.$options.promiseController = { resolve, reject };

            this.opened = true;

            return promise;
        },
        close() {
            this.$options.promiseController.resolve(false);
            this.opened = false;
        },
        select() {
            this.$options.promiseController.resolve(this.date);
            this.opened = false;
        }
    }
};
</script>

<template>
    <li>
        <LetterViewModal v-if="letterViewVisible" @close="closeLetterView" :letter="letter" />
        <div class="row no-gutters reminders-list-item m-0">
            <div
                class="col-12"
                :class="{
                    main: date.type,
                    noMain: !date.type
                }"
            >
                <p v-if="date.type" class="time">{{ date.value }}</p>
            </div>
            <div class="col-12 mb-1 px-3 text-right">
                <i
                    class="text-dark"
                    :class="{
                        'text-success_alt': isSystemComment
                    }"
                >
                    {{ data.title || '&#8212;' }}
                </i>
            </div>

            <div class="col-12 comment px-3">
                <p class="d-inline" v-html="timeHTML + data.comment"></p>
                <a
                    v-if="data.letter_id"
                    @click="openLetterView"
                    class="d-inline text-primary ml-2"
                    :href="'/letters/' + data.letter_id"
                    >посмотреть</a
                >
            </div>
        </div>
    </li>
</template>

<script>
import api from '@/api/api.js';
import LetterViewModal from '@/components/common/Letter/LetterViewModal.vue';
import dayjs from 'dayjs';

export default {
    name: 'TimelineCommentsItem',
    components: {
        LetterViewModal
    },
    props: {
        data: {
            type: Object
        },
        preventComment: {
            type: Object
        }
    },
    data() {
        return {
            letterViewVisible: false,
            letter: null
        };
    },
    computed: {
        isSystemComment() {
            return !this.data.title || this.data.title.includes('система');
        },

        date() {
            const result = {
                value: null,
                type: 1
            };

            let date = dayjs(this.data.created_at);

            if (this.preventComment && date.isSame(dayjs(this.preventComment.created_at), 'day')) {
                result.value = date.format('HH:mm');
                result.type = 0;
            } else if (date.isToday()) result.value = 'Сегодня';
            else if (date.isYesterday()) result.value = 'Вчера';
            else result.value = this.data.created_at_format;

            return result;
        },
        time() {
            return dayjs(this.data.created_at).format('HH:mm');
        },
        timeHTML() {
            return `<span class="d-inline time">${this.time} </span>`;
        }
    },
    methods: {
        async openLetterView(e) {
            e.preventDefault();
            let letter = await api.letter.get(this.data.letter_id);
            if (letter === false) {
                return;
            }
            this.letter = letter;
            this.letterViewVisible = true;
        },
        closeLetterView() {
            this.letterViewVisible = false;
            this.letter = null;
        }
    }
};
</script>

<style></style>

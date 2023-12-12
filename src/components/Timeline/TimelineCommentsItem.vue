<template>
    <li>
        <LetterViewModal
            v-if="letterViewVisible"
            :letter="letter"
            @close="closeLetterView"
        />
        <div class="row no-gutters reminders-list-item m-0">
            <div
                class="col-12"
                :class="{
          main: date.type,
          noMain: !date.type,
        }"
            >
                <p class="time" v-if="date.type">{{ date.value }}</p>
            </div>
            <div class="col-12 mb-1 px-3 text-right">
                <i
                    class="text-dark"
                    :class="{
            'text-success_alt': isSystemComment,
          }"
                >
                    {{ data.title || "&#8212;" }}
                </i>
            </div>

            <div class="col-12 comment px-3">
                <p v-html="timeHTML + data.comment" class="d-inline"></p>
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
import moment from "moment";
import api from "@/api/api.js";
import LetterViewModal from "@/components/Letter/LetterViewModal.vue";


export default {
    name: "TimelineCommentsItem",
    components: {
        LetterViewModal

    },
    data() {
        return {
            letterViewVisible: false,
            letter: null,
        };
    },
    props: {
        data: {
            type: Object,
        },
        preventComment: {
            type: Object,
        },
    },
    computed: {
        isSystemComment() {
            if (!this.data.title) {
                return true;
            }
            if (this.data.title.includes("система")) {
                return true;
            }
            return false;
        },

        date() {
            // const dateFormat = "YYYY-MM-DDTHH:mm:ss";
            const result = {
                value: null,
                type: 1,
            };
            const dateFormat = "YYYY-MM-DD";
            const timeFormat = "HH:mm";
            let date = moment(this.data.created_at).format(dateFormat);

            if (this.preventComment) {
                let preventDate = moment(this.preventComment.created_at).format(
                    dateFormat
                );
                if (date == preventDate) {
                    result.value = moment(this.data.created_at).format(timeFormat);
                    result.type = 0;
                    return result;
                }
            }

            let currentDate = moment(new Date()).format(dateFormat);
            if (date == currentDate) {
                result.value = "сегодня";
                return result;
            }
            let preventDayDate = moment().subtract(1, "days").format(dateFormat);
            if (date == preventDayDate) {
                result.value = "вчера";
                return result;
            }
            result.value = this.data.created_at_format;
            return result;
        },
        time() {
            const timeFormat = "HH:mm";
            return moment(this.data.created_at).format(timeFormat);
        },
        timeHTML() {
            return `<span class="d-inline time">${this.time} </span>`;
        },
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
        },
    },
};
</script>

<style>
</style>
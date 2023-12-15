<template>
    <div class="comments">
        <div class="reminders">
            <ul class="comments">
                <li v-if="!data.length" class="text-center m-0">
                    <p>нет комментариев</p>
                </li>
                <TimelineCommentsItem
                    v-for="(comment, index) in data"
                    :key="comment.id"
                    :data="comment"
                    :preventComment="getPreventComment(index)"
                />
            </ul>
        </div>
    </div>
</template>

<script>
import TimelineCommentsItem from '@/components/Timeline/TimelineCommentsItem.vue';

export default {
    name: 'TimelineComments',
    components: {
        TimelineCommentsItem
    },
    props: {
        data: {
            type: Array
        }
    },

    methods: {
        getPreventComment(index) {
            if (!index) {
                return null;
            }
            if (Array.isArray(this.data) && this.data[index - 1]) {
                return this.data[index - 1];
            }
        }
    }
};
</script>

<style></style>
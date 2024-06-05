<template>
    <div class="timeline-logs-comments">
        <p v-if="!data.length" class="text-center my-4">Нет комментириев</p>
        <ul class="timeline-logs-comments__list">
            <TimelineCommentsItem
                v-for="(comment, index) in data"
                :key="comment.id"
                @view="$emit('view', $event)"
                :data="comment"
                :prevent-comment="getPreventComment(index)"
            />
        </ul>
    </div>
</template>

<script>
import TimelineCommentsItem from '@/components/Timeline/TimelineCommentsItem.vue';

export default {
    name: 'TimelineComments',
    components: {
        TimelineCommentsItem
    },
    emits: ['view'],
    props: {
        data: {
            type: Array,
            default: () => []
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

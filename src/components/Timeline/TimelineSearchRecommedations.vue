<template>
    <div class="timeline-recommendations">
        <p class="timeline-recommendations__title">В поиске учитываются:</p>
        <p
            v-for="(recommendation, key) in recommendations"
            :key="key"
            class="timeline-recommendations__item"
        >
            - {{ recommendation }}
        </p>
    </div>
</template>
<script>
export default {
    name: 'TimelineSearchRecommendations',
    props: {
        recommendations: {
            type: Array,
            required: true
        }
    }
};
</script>

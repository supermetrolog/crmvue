<template>
    <div class="d-flex flex-column">
        <div class="d-flex flex-wrap gap-1 mb-2">
            <div v-if="question.group" v-tippy="'Группа'" class="dashboard-bg-light br-1 p-1 fs-2">
                {{ question.group }}
            </div>
            <div
                v-if="question.template"
                v-tippy="'Шаблон'"
                class="dashboard-bg-light br-1 p-1 fs-2"
            >
                {{ question.template }}
            </div>
        </div>
        <div>
            <p>{{ question.text }}</p>
        </div>
    </div>
</template>
<script setup>
defineProps({
    question: Object
});
</script>

<template>
    <div class="d-flex flex-column">
        <div class="d-flex flex-wrap gap-1 mb-2">
            <div v-tippy="'Категория'" class="dashboard-bg-light br-1 p-1 fs-2">
                {{ element.category }}
            </div>
            <div
                v-if="element.question"
                v-tippy="'Вопрос'"
                class="br-1 p-1 fs-2"
                :class="[
                    element.question.deleted_at ? 'dashboard-bg-danger-l' : 'dashboard-bg-light '
                ]"
            >
                <i class="fa-regular fa-question-circle" />
                #{{ element.question.id }}
                {{ element.question.text }}
            </div>
        </div>
        <div>
            <span v-if="element.value === null || element.value.length === 0">
                <i class="text-through">Без текста</i>
            </span>
            <span v-else>
                {{ element.value }}
            </span>
        </div>
        <div v-if="element.effects?.length">
            <hr />
            <p class="fs-2">Эффекты:</p>
            <div class="d-flex flex-wrap gap-1 mt-1">
                <div
                    v-for="effect in element.effects"
                    :key="effect.id"
                    class="br-1 p-1 fs-2"
                    :class="[effect.active ? 'dashboard-bg-light' : 'dashboard-bg-danger-l ']"
                >
                    <i class="fa-solid fa-wand-magic-sparkles" />
                    #{{ effect.id }}
                    {{ effect.title }}
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
defineProps({
    element: {
        type: Object,
        required: true
    }
});
</script>

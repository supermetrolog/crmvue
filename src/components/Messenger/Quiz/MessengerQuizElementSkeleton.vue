<template>
    <div class="messenger-quiz-element skeleton-body">
        <div class="avatar skeleton" :style="{ '--size': '60px' }"></div>
        <div class="messenger-quiz-element__description">
            <p class="messenger-quiz-element__author skeleton">Загружаем данные с сервера..</p>
            <p class="skeleton">Загружаем данные..</p>
        </div>
        <div class="messenger-quiz-element__meta">
            <p class="skeleton">Загружаем данные..</p>
        </div>
    </div>
</template>
<script>
export default {
    name: 'MessengerQuizElementSkeleton'
};
</script>

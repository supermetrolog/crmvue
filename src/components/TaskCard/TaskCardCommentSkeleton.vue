<template>
    <div class="task-card-comment skeleton-body">
        <Avatar :size="30" class="skeleton" />
        <div class="task-card-comment__content">
            <div class="task-card-comment__header">
                <span class="task-card-comment__username skeleton">Иван Иванов</span>
                <span class="task-card-comment__dot mx-1">·</span>
                <span class="task-card-comment__date skeleton">11.11.1111</span>
            </div>
            <div class="task-card-comment__message mt-1">
                <p class="skeleton mb-1">Небольшое сообщение, как будто бы это что-то</p>
                <p class="skeleton">В котором действительно есть.</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Avatar from '@/components/common/Avatar.vue';
</script>

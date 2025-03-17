<template>
    <div class="company-contact-item__comments position-relative">
        <Loader v-if="isLoading" />
        <div class="col-12">
            <div v-if="comments.length">
                <div v-for="comment in comments" :key="comment.id">
                    <strong>{{ comment.author.userProfile.short_name }}</strong>
                    <p>{{ comment.comment }}</p>
                    <small class="text-grey">{{ comment.created_at }}</small>
                </div>
                <hr />
            </div>
            <EmptyLabel v-else>Комментарии отсутствуют</EmptyLabel>
        </div>
        <div class="col-12 mt-2">
            <UiTextarea v-model="comment" class="company-contact-item__textarea"></UiTextarea>
            <Button @click="createComment" success small class="w-100 mt-1">Отправить</Button>
        </div>
    </div>
</template>

<script setup>
import Loader from '@/components/common/Loader.vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import Button from '@/components/common/Button.vue';
import EmptyLabel from '@/components/common/EmptyLabel.vue';
import { shallowRef } from 'vue';

const emit = defineEmits(['create']);
defineProps({
    comments: {
        type: Array,
        required: true
    }
});

const comment = shallowRef('');
const isLoading = shallowRef(false);

const createComment = async () => {
    isLoading.value = true;
    await emit('create', comment.value);
    comment.value = '';

    isLoading.value = false;
};
</script>

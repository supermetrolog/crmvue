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
            <Textarea v-model="comment" class="company-contact-item__textarea"></Textarea>
            <Button @click="createComment" success small class="w-100 mt-1">Отправить</Button>
        </div>
    </div>
</template>

<script>
import Loader from '@/components/common/Loader.vue';
import Textarea from '@/components/common/Forms/Textarea.vue';
import Button from '@/components/common/Button.vue';
import EmptyLabel from '@/components/common/EmptyLabel.vue';

export default {
    name: 'CompanyContactItemComments',
    components: {
        EmptyLabel,
        Button,
        Textarea,
        Loader
    },
    emits: ['create'],
    props: {
        comments: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            comment: '',
            isLoading: false
        };
    },
    methods: {
        async createComment() {
            this.isLoading = true;

            await this.$emit('create', this.comment);
            this.comment = '';

            this.isLoading = false;
        }
    }
};
</script>

<style></style>

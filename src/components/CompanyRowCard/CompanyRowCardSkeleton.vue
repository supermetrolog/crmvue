<template>
    <div
        class="task-card-relation-company messenger-dialog-company position-relative skeleton-body"
    >
        <div class="messenger-dialog__body messenger-dialog-company__body">
            <div class="messenger-dialog-company__preview">
                <CompanyLogoSkeleton class="messenger-dialog-company__image" :size="75" />
                <span class="messenger-dialog-company__id skeleton skeleton--rect ml-1 mt-1">
                    1234
                </span>
            </div>
            <div class="messenger-dialog-company__description">
                <p class="messenger-dialog-company__company">
                    <span class="skeleton">Default Company Medium Name</span>
                    <Avatar :size="25" class="messenger-dialog-company__avatar skeleton" />
                </p>
                <div class="messenger-dialog-company__text">
                    <p class="messenger-dialog-company__category skeleton mb-1">
                        Группа деятельности
                    </p>
                    <p class="messenger-dialog-company__category skeleton">Несколько категорий</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import Avatar from '@/components/common/Avatar.vue';
import CompanyLogoSkeleton from '@/components/Company/CompanyLogoSkeleton.vue';
</script>

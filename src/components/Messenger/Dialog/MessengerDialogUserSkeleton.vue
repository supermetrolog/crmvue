<template>
    <div class="messenger-dialog messenger-dialog-user skeleton-body">
        <div class="messenger-dialog__body messenger-dialog-user__body">
            <div class="messenger-dialog-user__preview">
                <div class="avatar skeleton" style="--size: 60px"></div>
            </div>
            <div class="messenger-dialog-user__description">
                <p class="messenger-dialog-user__name skeleton mb-1">[Фамилия Имя Отчество]</p>
                <p class="messenger-dialog-user__role skeleton">[Должность]</p>
            </div>
        </div>
        <div class="messenger-dialog__footer">
            <div class="messenger-dialog-functions">
                <div v-for="i in 4" :key="i" class="messenger-dialog-functions__item skeleton">
                    <i class="fa-solid fa-bolt"></i>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup></script>

<template>
    <div class="messenger-dialog messenger-dialog-request skeleton-body">
        <div class="messenger-dialog__body messenger-dialog-request__body">
            <p class="messenger-dialog-request__header">
                <span class="messenger-dialog-request__id skeleton">ID1234</span>
                <span class="messenger-dialog-request__company skeleton">[Название компании]</span>
            </p>
            <p class="messenger-dialog-request__category skeleton">[Категория товаров]</p>
            <p class="messenger-dialog-request__description skeleton">Описание</p>
        </div>
        <div class="messenger-dialog__footer">
            <div class="messenger-dialog__phone skeleton">
                <span class="messenger-dialog__last-call"></span>
                <span class="messenger-dialog__icon"></span>
            </div>
            <div class="messenger-dialog-functions">
                <div v-for="i in 4" :key="i" class="messenger-dialog-functions__item skeleton">
                    <i class="fa-solid fa-bolt"></i>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'MessengerDialogRequestSkeleton'
};
</script>

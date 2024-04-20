<template>
    <div class="messenger-dialog messenger-dialog-offer skeleton-body">
        <div class="messenger-dialog__body messenger-dialog-offer__body">
            <div class="messenger-dialog-offer__preview">
                <div class="messenger-dialog-offer__image skeleton"></div>
            </div>
            <div class="messenger-dialog-offer__description">
                <p class="messenger-dialog-offer__company skeleton">[Название компании]</p>
                <p class="messenger-dialog-offer__category skeleton">
                    <span>[Тип сделки]</span>
                </p>
                <p class="messenger-dialog-offer__address skeleton">[Адрес объекта]</p>
            </div>
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
    name: 'MessengerDialogObjectSkeleton'
};
</script>

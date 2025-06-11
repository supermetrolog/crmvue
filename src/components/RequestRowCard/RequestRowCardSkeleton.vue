<template>
    <div class="request-row-card">
        <div class="request-row-card__except">
            <div class="request-row-card__column">
                <p class="request-row-card__id skeleton">#123</p>
                <div class="avatar skeleton" :style="{ '--size': '40px' }"></div>
            </div>
            <div class="request-row-card__info">
                <p class="font-weight-bold skeleton">12345</p>
                <span class="skeleton">1235435</span>
                <p class="request-row-card__location">
                    <i class="fa-solid fa-earth mr-1"></i>
                    <span class="skeleton">Локация запроса</span>
                </p>
                <div class="request-row-card__date skeleton">Создан 111111</div>
            </div>
        </div>
        <div class="request-row-card__body">
            <div class="request-row-card__header">
                <div class="request-row-card__description">
                    <p class="skeleton">Описание запроса..</p>
                </div>
            </div>
            <div class="request-row-card__footer request-row-card__footer--empty">
                <Spinner class="absolute-center" small />
            </div>
        </div>
    </div>
</template>
<script setup>
import Spinner from '@/components/common/Spinner.vue';
</script>

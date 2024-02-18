<template>
    <div class="trade-offer-item__actions">
        <div class="trade-offer-item__buttons">
            <button
                v-if="buttons.edit"
                v-tippy="'Редактировать'"
                :disabled="buttons.edit.disabled"
                class="trade-offer-item__button"
            >
                <i class="fas fa-pen"></i>
            </button>
            <button
                v-if="buttons.advert"
                v-tippy="'Отправить в рекламу'"
                :disabled="buttons.advert.disabled"
                class="trade-offer-item__button"
                :class="{ active: buttons.advert.value }"
            >
                <i class="fas fa-rocket"></i>
            </button>
            <button
                v-if="buttons.deal"
                v-tippy="'Создать сделку'"
                :disabled="buttons.deal.disabled"
                class="trade-offer-item__button"
                :class="{ active: buttons.deal.value }"
            >
                <i class="fa-solid fa-handshake"></i>
            </button>
            <button
                v-if="buttons.pdf"
                v-tippy="'Открыть PDF'"
                :disabled="buttons.pdf.disabled"
                class="trade-offer-item__button"
            >
                <i class="fas fa-file-pdf"></i>
            </button>
            <button
                v-if="buttons.favorite"
                v-tippy="'Добавить в избранное'"
                :disabled="buttons.favorite.disabled"
                class="trade-offer-item__button trade-offer-item__button--orange"
                :class="{ active: buttons.favorite.value }"
            >
                <i class="fas fa-star"></i>
            </button>
            <button
                v-if="buttons.notifications"
                v-tippy="'Создать уведомление'"
                :disabled="buttons.notifications.disabled"
                class="trade-offer-item__button"
                :class="{ active: buttons.notifications.value }"
            >
                <i class="fas fa-bell"></i>
            </button>
            <button
                v-if="buttons.dislike"
                v-tippy="`Пожаловаться`"
                :disabled="buttons.dislike.disabled"
                class="trade-offer-item__button"
                :class="{ active: buttons.dislike.value }"
            >
                <i class="fa-solid fa-thumbs-down"></i>
            </button>
            <button
                v-if="buttons.delete"
                v-tippy="buttons.delete.label ?? `Удалить`"
                :disabled="buttons.dislike.disabled"
                class="trade-offer-item__button trade-offer-item__button--red"
            >
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ComplexActions',
    props: {
        buttons: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {};
    },
    methods: {}
};
</script>

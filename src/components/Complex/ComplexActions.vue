<template>
    <div class="complex-actions" :class="{ 'complex-actions--simple': simple }">
        <div class="complex-actions__buttons">
            <button
                v-if="buttons.edit"
                v-tippy="'Редактировать'"
                :disabled="buttons.edit.disabled"
                class="complex-actions__button"
            >
                <i class="fas fa-pen"></i>
            </button>
            <button
                v-if="buttons.advert"
                v-tippy="'Отправить в рекламу'"
                :disabled="buttons.advert.disabled"
                class="complex-actions__button"
                :class="{ active: buttons.advert.value }"
            >
                <i class="fas fa-rocket"></i>
            </button>
            <button
                v-if="buttons.deal"
                v-tippy="'Создать сделку'"
                :disabled="buttons.deal.disabled"
                class="complex-actions__button"
                :class="{ active: buttons.deal.value }"
            >
                <i class="fa-solid fa-handshake"></i>
            </button>
            <button
                v-if="buttons.pdf"
                v-tippy="'Открыть PDF'"
                @click="buttons.pdf.handler"
                :disabled="buttons.pdf.disabled"
                class="complex-actions__button"
            >
                <i class="fas fa-file-pdf"></i>
            </button>
            <button
                v-if="buttons.favorite"
                v-tippy="'Добавить в избранное'"
                :disabled="buttons.favorite.disabled"
                class="complex-actions__button"
                :class="{ active: buttons.favorite.value }"
            >
                <i class="fas fa-star"></i>
            </button>
            <button
                v-if="buttons.notifications"
                v-tippy="'Создать уведомление'"
                :disabled="buttons.notifications.disabled"
                class="complex-actions__button"
                :class="{ active: buttons.notifications.value }"
            >
                <i class="fas fa-bell"></i>
            </button>
            <button
                v-if="buttons.photos"
                v-tippy="`Скачать фотографии`"
                @click="buttons.photos.handler"
                :disabled="buttons.photos.disabled"
                class="complex-actions__button"
            >
                <i class="fa-regular fa-image"></i>
            </button>
            <button
                v-if="buttons.dislike"
                v-tippy="`Пожаловаться`"
                :disabled="buttons.dislike.disabled"
                class="complex-actions__button"
                :class="{ active: buttons.dislike.value }"
            >
                <i class="fa-solid fa-thumbs-down"></i>
            </button>
            <button
                v-if="buttons.copy"
                v-tippy="`Копировать ссылку`"
                @click="buttons.copy.handler"
                :disabled="buttons.copy.disabled"
                class="complex-actions__button"
            >
                <i class="fa-solid fa-share-from-square"></i>
            </button>
            <button
                v-if="buttons.cadastral"
                v-tippy="buttons.cadastral.label ?? `Открыть на кадастровой карте`"
                @click="buttons.cadastral.handler"
                :disabled="buttons.cadastral.disabled"
                class="complex-actions__button"
            >
                <i class="fa-solid fa-map-location-dot"></i>
            </button>
            <button
                v-if="buttons.delete"
                v-tippy="buttons.delete.label ?? `Удалить`"
                :disabled="buttons.delete.disabled"
                class="complex-actions__button"
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
        },
        simple: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {};
    },
    methods: {}
};
</script>

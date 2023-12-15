<template>
    <ul class="action-buttons">
        <li v-if="edit" class="action-buttons__item">
            <button class="action-buttons__button">
                <i class="fas fa-pen"></i>
            </button>
        </li>
        <li v-if="advert" class="action-buttons__item">
            <button class="action-buttons__button action-buttons__button_advert" :class="{ active: advert.value }">
                <i class="fas fa-rocket"></i>
            </button>
        </li>
        <li v-if="pdf" class="action-buttons__item">
            <button class="action-buttons__button">
                <i class="fas fa-file-pdf"></i>
            </button>
        </li>
        <li v-if="favorite" class="action-buttons__item">
            <button class="action-buttons__button action-buttons__button_favorite" :class="{ active: favorite.value }">
                <i class="fas fa-star"></i>
            </button>
        </li>
        <li v-if="notifications" class="action-buttons__item">
            <button
                class="action-buttons__button action-buttons__button_notifications"
                :class="{ active: notifications.value }"
            >
                <i class="fas fa-bell"></i>
            </button>
        </li>
        <li v-if="dislike" class="action-buttons__item">
            <button class="action-buttons__button action-buttons__button_dislike" :class="{ active: dislike.value }">
                <i class="fas fa-thumbs-down"></i>
            </button>
        </li>
    </ul>
</template>

<script>
export default {
    name: 'ActionButton',
    components: {},
    props: {
        edit: {
            type: Object
        },
        advert: {
            type: Object
        },
        pdf: {
            type: Object
        },
        favorite: {
            type: Object
        },
        notifications: {
            type: Object
        },
        dislike: {
            type: Object
        }
    },
    data() {
        return {};
    },
    methods: {}
};
</script>
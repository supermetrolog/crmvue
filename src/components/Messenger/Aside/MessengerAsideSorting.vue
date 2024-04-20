<template>
    <div class="messenger-aside-sorting">
        <VDropdown>
            <template #trigger>
                <button v-tippy="'Сортировка'" class="messenger-aside-sorting__button rounded-icon">
                    <i class="fa-solid fa-arrow-down-wide-short"></i>
                </button>
            </template>
            <div class="messenger-aside-sorting__list">
                <a class="messenger-aside-sorting__option" href="#">
                    <span>По ID</span>
                    <i class="fa-solid fa-arrow-down"></i>
                </a>
                <a class="messenger-aside-sorting__option" href="#">
                    <span>По ID</span>
                    <i class="fa-solid fa-arrow-up"></i>
                </a>
                <a class="messenger-aside-sorting__option" href="#">
                    <span>По дате последнего звонка</span>
                    <i class="fa-solid fa-arrow-down"></i>
                </a>
                <a class="messenger-aside-sorting__option" href="#">
                    <span>По дате последнего звонка</span>
                    <i class="fa-solid fa-arrow-up"></i>
                </a>
                <a class="messenger-aside-sorting__option" href="#">
                    <span>По дате обновления</span>
                    <i class="fa-solid fa-arrow-down"></i>
                </a>
                <a class="messenger-aside-sorting__option" href="#">
                    <span>По дате обновления</span>
                    <i class="fa-solid fa-arrow-up"></i>
                </a>
            </div>
        </VDropdown>
        <button
            v-tippy="'Фильтр'"
            @click.stop="filersIsOpened = true"
            class="messenger-aside-sorting__button rounded-icon"
        >
            <i class="fa-solid fa-filter"></i>
        </button>
        <teleport to="body">
            <FormModalMessengerFilters
                v-if="filersIsOpened"
                v-model="filters"
                @close="filersIsOpened = false"
            />
        </teleport>
    </div>
</template>
<script>
import VDropdown from '@/components/common/Dropdown/VDropdown.vue';
import FormModalMessengerFilters from '@/components/Forms/FormModalMessengerFilters.vue';

export default {
    name: 'MessengerAsideSorting',
    components: { FormModalMessengerFilters, VDropdown },
    props: {
        title: {
            type: String,
            default: 'Список'
        }
    },
    data() {
        return {
            filters: {},
            filersIsOpened: false
        };
    }
};
</script>

<template>
    <div class="messenger-aside-sorting">
        <!--        <VDropdown>-->
        <!--            <template #trigger>-->
        <!--                <button v-tippy="'Сортировка'" class="messenger-aside-sorting__button rounded-icon">-->
        <!--                    <i class="fa-solid fa-arrow-down-wide-short"></i>-->
        <!--                </button>-->
        <!--            </template>-->
        <!--            <div class="messenger-aside-sorting__list">-->
        <!--                <a class="messenger-aside-sorting__option" href="#">-->
        <!--                    <span>По ID</span>-->
        <!--                    <i class="fa-solid fa-arrow-down"></i>-->
        <!--                </a>-->
        <!--                <a class="messenger-aside-sorting__option" href="#">-->
        <!--                    <span>По ID</span>-->
        <!--                    <i class="fa-solid fa-arrow-up"></i>-->
        <!--                </a>-->
        <!--                <a class="messenger-aside-sorting__option" href="#">-->
        <!--                    <span>По дате последнего звонка</span>-->
        <!--                    <i class="fa-solid fa-arrow-down"></i>-->
        <!--                </a>-->
        <!--                <a class="messenger-aside-sorting__option" href="#">-->
        <!--                    <span>По дате последнего звонка</span>-->
        <!--                    <i class="fa-solid fa-arrow-up"></i>-->
        <!--                </a>-->
        <!--                <a class="messenger-aside-sorting__option" href="#">-->
        <!--                    <span>По дате обновления</span>-->
        <!--                    <i class="fa-solid fa-arrow-down"></i>-->
        <!--                </a>-->
        <!--                <a class="messenger-aside-sorting__option" href="#">-->
        <!--                    <span>По дате обновления</span>-->
        <!--                    <i class="fa-solid fa-arrow-up"></i>-->
        <!--                </a>-->
        <!--            </div>-->
        <!--        </VDropdown>-->
        <AnimationTransition :speed="0.5">
            <button
                v-if="filtersCount"
                v-tippy="'Сбросить фильтры'"
                @click.stop="$emit('reset')"
                class="messenger-aside-sorting__button rounded-icon dashboard-bg-primary-l"
            >
                <i class="fa-solid fa-xmark"></i>
            </button>
        </AnimationTransition>
        <button
            v-if="consultantFilterCanBeUsed"
            v-tippy="'Показывать только те чаты, где Вы консультант'"
            @click.stop="toggleConsultantFilter"
            class="messenger-aside-sorting__button rounded-icon"
            :class="{ 'dashboard-bg-success text-white': hasConsultantFilter }"
        >
            <i class="fa-solid fa-user-tag"></i>
        </button>
        <button
            v-tippy="'Фильтр'"
            @click.stop="filersIsOpened = true"
            class="messenger-aside-sorting__button rounded-icon"
        >
            <span v-if="filtersCount" class="messenger-aside-sorting__badge">
                {{ filtersCount }}
            </span>
            <i class="fa-solid fa-filter"></i>
        </button>
        <teleport to="body">
            <FormModalMessengerFilters
                v-if="filersIsOpened"
                v-model="filters"
                @close="filersIsOpened = false"
            >
                <slot name="filters" />
            </FormModalMessengerFilters>
        </teleport>
    </div>
</template>
<script setup>
import FormModalMessengerFilters from '@/components/Forms/FormModalMessengerFilters.vue';
import { computed, ref } from 'vue';
import { isEmpty } from '@/utils/helpers/common/isEmpty.js';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import { useAuth } from '@/composables/useAuth.js';
import { useStore } from 'vuex';
import { messenger } from '@/const/messenger.js';

const filters = defineModel('filters');
// const sorts = defineModel('sort');
defineEmits(['reset']);
defineProps({
    title: {
        type: String,
        default: 'Список'
    }
});

const { currentUserId } = useAuth();
const store = useStore();

const filersIsOpened = ref(false);

const filtersCount = computed(() => {
    return Object.values(filters.value).filter(element => !isEmpty(element)).length;
});

const consultantFilterCanBeUsed = computed(() => {
    return (
        store.state.Messenger.currentAsidePanel &&
        store.state.Messenger.currentAsidePanel !== messenger.tabs.USERS
    );
});

function toggleConsultantFilter() {
    if (hasConsultantFilter.value) filters.value.consultant_ids = [];
    else filters.value.consultant_ids = [currentUserId.value];
}

const hasConsultantFilter = computed(() => {
    return (
        filters.value.consultant_ids?.length &&
        filters.value.consultant_ids[0] === currentUserId.value
    );
});
</script>

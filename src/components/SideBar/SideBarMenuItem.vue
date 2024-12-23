<template>
    <li class="sidebar__item">
        <Tippy
            v-if="item.internal"
            :delay="[500, 0]"
            interactive
            :interactive-border="15"
            placement="right-end"
        >
            <router-link
                class="sidebar__link"
                active-class="active"
                :to="item.url"
                exact-active-class="exact-active"
            >
                <i class="sidebar__icon" :class="item.icon"></i>
                <span>
                    {{ item.name }}
                    <i class="fa-solid fa-caret-right"></i>
                </span>
            </router-link>
            <template #content>
                <div class="sidebar__internal">
                    <SideBarMenuItem
                        v-for="item in item.internal"
                        :key="item.id"
                        :item="item"
                        class="sidebar__internal-item"
                        internal
                    />
                </div>
            </template>
        </Tippy>
        <router-link
            v-else
            :to="item.url"
            :exact="item.exact"
            :class="{ internal: internal }"
            active-class="active"
            exact-active-class="exact-active"
            class="sidebar__link"
        >
            <i class="sidebar__icon" :class="item.icon"></i>
            {{ item.name }}
        </router-link>
    </li>
</template>

<script setup>
import { Tippy } from 'vue-tippy';

defineProps({
    item: {
        id: Number,
        name: String,
        url: {
            type: String,
            default: '#'
        },
        exact: {
            type: Boolean,
            default: false
        },
        icon: {
            type: String,
            required: true
        },
        internal: Array,
        required: true
    },
    internal: Boolean
});
</script>

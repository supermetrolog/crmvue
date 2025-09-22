<template>
    <li class="sidebar__item">
        <Tippy
            v-if="internalMenu.length"
            :delay="[500, 0]"
            interactive
            :interactive-border="15"
            placement="right-end"
        >
            <router-link
                class="sidebar__link"
                active-class="active"
                :to="{ name: item.to }"
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
                        v-for="item in internalMenu"
                        :key="item.key"
                        :item="item.config"
                        class="sidebar__internal-item"
                        internal
                    />
                </div>
            </template>
        </Tippy>
        <router-link
            v-else
            :to="{ name: item.to }"
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

<script setup lang="ts">
import { Tippy } from 'vue-tippy';
import { computed } from 'vue';
import { isNullish } from '@/utils/helpers/common/isNullish.ts';
import { useAuth } from '@/composables/useAuth';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';
import { GeneralMenuItemConfig, InternalMenuItemConfig } from '@/const/menu';

const props = defineProps<{
    item: GeneralMenuItemConfig | InternalMenuItemConfig;
    internal?: boolean;
}>();

const { currentUser } = useAuth();

const internalMenu = computed(() => {
    if (isNullish(props.item.internal)) return [];

    return props.item.internal
        .filter(menuItem => {
            if (isNotNullish(menuItem.auth)) return menuItem.auth.has(currentUser.value.role);
            return true;
        })
        .map((item, key) => ({ key, config: item }));
});
</script>

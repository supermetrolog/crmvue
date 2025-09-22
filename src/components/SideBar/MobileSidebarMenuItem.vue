<template>
    <li class="sidebar-mobile-menu__item">
        <MobileSidebarMenuExtra v-if="internalMenu.length" :link="item" :internal="internalMenu" />
        <router-link
            v-else
            active-class="active"
            class="sidebar-mobile-menu__link"
            :to="{ name: item.to }"
        >
            <i :class="item.icon" />
            <span>{{ item.name }}</span>
        </router-link>
    </li>
</template>

<script setup lang="ts">
import MobileSidebarMenuExtra from '@/components/SideBar/MobileSidebarMenuExtra.vue';
import { computed } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { isNullish } from '@/utils/helpers/common/isNullish.ts';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';
import { GeneralMenuItemConfig } from '@/const/menu';

const props = defineProps<{
    item: GeneralMenuItemConfig;
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

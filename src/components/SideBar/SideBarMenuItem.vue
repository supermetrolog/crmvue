<template>
    <li class="sidebar__item">
        <router-link class="sidebar__link" active-class="active" :to="item.url" :exact="item.exact">
            <i class="sidebar__icon" :class="item.icon"></i>
            {{ item.name }}
        </router-link>
    </li>
</template>

<script>
export default {
    name: 'SideBarMenuItem',
    props: {
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
            required: true
        }
    }
};
</script>
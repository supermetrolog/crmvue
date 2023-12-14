<template>
    <div class="list">
        <Item
            v-for="item in data"
            :key="item"
            :item="item"
            @remove="(value) => $emit('remove', value)"
        />
    </div>
</template>

<script>
import Item from "./ListItem.vue";

export default {
    name: "List",
    components: {
        Item,
    },
    props: {
        data: {
            type: Array,
            required: true,
        },
    },
};
</script>
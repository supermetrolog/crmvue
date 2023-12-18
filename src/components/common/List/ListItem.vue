<template>
    <div class="item">
        <p v-html="item.label"></p>
        <i @click="$emit('remove', item.value)" class="fas fa-times"></i>
    </div>
</template>

<script>
export default {
    name: 'ListItem',
    props: {
        item: {
            type: Object,
            required: true
        }
    }
};
</script>

<style lang="scss" scoped>
.item {
    padding: 5px 25px 5px 5px;
    border: 1px solid #7c7c86;
    background-color: #f7f7f7;
    border-radius: 4px;
    color: #2d2f34;
    display: flex;
    position: relative;
    text-transform: capitalize;

    p {
        font-weight: 400;
    }

    i {
        color: lightcoral;
        position: absolute;
        right: 5px;
        top: 8px;
        cursor: pointer;

        &:hover {
            color: #f93154;
        }
    }
}
</style>
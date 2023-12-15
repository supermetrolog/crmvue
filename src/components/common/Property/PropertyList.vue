<template>
    <div class="PropertyList">
        <template v-if="isMultipleList">
            <template v-for="(t, idx) in title" :key="t">
                <p v-if="t" class="PropertyList-header">{{ t }}</p>
                <ul class="PropertyList-list">
                    <slot :name="idx"></slot>
                </ul>
            </template>
        </template>
        <template v-else>
            <p v-if="title" class="PropertyList-header">{{ title }}</p>
            <ul class="PropertyList-list">
                <slot></slot>
            </ul>
        </template>
    </div>
</template>

<script>
export default {
    name: 'PropertyList',
    components: {},
    props: {
        title: {
            type: [String, Array]
        }
    },
    computed: {
        isMultipleList() {
            return Array.isArray(this.title);
        }
    },
    methods: {}
};
</script>
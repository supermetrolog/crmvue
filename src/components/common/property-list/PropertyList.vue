<template>
    <div class="PropertyList">
        <template v-if="!isMultipleList">
            <p class="PropertyList-header" v-if="title">{{ title }}</p>
            <ul class="PropertyList-list">
                <slot></slot>
            </ul>
        </template>
        <template v-if="isMultipleList">
            <template v-for="(t, idx) in title" :key="t">
                <p class="PropertyList-header" v-if="t">{{ t }}</p>
                <ul class="PropertyList-list">
                    <slot :name="idx"></slot>
                </ul>
            </template>
        </template>
    </div>
</template>

<script>
import './styles.scss'

export default {
    name: 'PropertyList',
    components: {},
    props: {
        title: {
            type: [String, Array],
        },
    },
    computed: {
        isMultipleList() {
            return Array.isArray(this.title);
        }
    },
    methods: {
    }
}
</script>

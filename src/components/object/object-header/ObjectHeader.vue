<template>
    <div class="ObjectHeader">
        <div class="ObjectHeader-content">
            <h1 class="ObjectHeader-name">{{ name }}</h1>
            <span class="ObjectHeader-description">
                <strong>ID комплекса {{ id }}, </strong>
                поступление {{ creationDate }}, {{ consultant }}, обновление {{ updateDate }}</span>
        </div>
        <div class="ObjectHeader-actions" v-if="editAccess">
            <button @click.prevent="clickUpdate">
                <i class="fas fa-pen text-primary edit"></i>
            </button>
        </div>
    </div>
</template>

<script>
import './styles.scss'
export default {
    name: 'ObjectHeader',
    components: {},
    props: {
        name: {
            type: String,
            default: 'Безымянный'
        },
        id: {
            type: Number,
            required: true
        },
        creationDate: {
            type: String,
            default: 'неизвестно'
        },
        updateDate: {
            type: String,
            default: 'неизвестно'
        },
        consultant: {
            type: String,
            default: 'неизвестен'
        },
        editAccess: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {

        }
    },
    computed: {},
    methods: {
        clickUpdate() {
            this.$emit('updateObject')
        }
    }
}
</script>
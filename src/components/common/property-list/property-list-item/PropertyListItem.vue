<template>
    <li class="PropertyListItem">
        <div class="PropertyListItem-name">{{ name }}</div>
        <div class="PropertyListItem-value">
            {{ value }}
            <span v-if="unit" v-html="unitTypesList.get(unit)"></span>
        </div>
    </li>
</template>

<script>
import { UnitTypesList } from '@/const/Const'
import './styles.scss'

export default {
    name: 'PropertyListItem',
    props: {
        name: {
            type: String,
            default: null
        },
        value: {
            default: null
        },
        unit: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            unitTypesList: UnitTypesList
        }
    },
}
</script>

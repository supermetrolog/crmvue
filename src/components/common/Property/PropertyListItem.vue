<template>
    <li class="PropertyListItem">
        <p class="PropertyListItem-name">{{ name }}:</p>
        <div class="PropertyListItem-value">
            <slot>не заполнено</slot>
        </div>
    </li>
</template>

<script>
import { unitTypes } from '@/const/unitTypes';

export default {
    name: 'PropertyListItem',
    components: {},
    props: {
        name: {
            type: String,
            default: 'Дефолтное значение'
        }
    },
    data() {
        return {
            unitTypes
        };
    }
};
</script>
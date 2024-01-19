<template>
    <Tippy class="tooltip">
        <template #default>
            <i class="fa-solid fa-circle-info" />
        </template>
        <template #content>
            <div class="tooltip__text">
                {{ text }}
            </div>
        </template>
    </Tippy>
</template>
<script>
import { Tippy } from 'vue-tippy';

export default {
    name: 'Tooltip',
    components: { Tippy },
    props: {
        text: {
            type: String,
            default: null
        }
    }
};
</script>

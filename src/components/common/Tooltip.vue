<template>
    <Tippy class="tooltip">
        <template #default>
            <slot name="trigger">
                <i :class="icon" />
            </slot>
        </template>
        <template #content>
            <slot name="content">
                <div class="tooltip__text">
                    {{ text }}
                </div>
            </slot>
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
        },
        icon: {
            type: String,
            default: 'fa-solid fa-circle-info'
        }
    }
};
</script>

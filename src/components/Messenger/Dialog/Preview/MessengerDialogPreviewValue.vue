<template>
    <div class="messenger-dialog-preview__value">
        <slot>
            <span class="messenger-dialog-preview__warning">
                <slot name="warning">не заполнено</slot>
            </span>
        </slot>
    </div>
</template>
<script setup></script>

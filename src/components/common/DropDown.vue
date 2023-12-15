<template>
    <transition name="dropdown">
        <slot />
    </transition>
</template>

<script>
export default {
    name: 'DropDown'
};
</script>

<style lang="scss" scoped>
.dropdown-enter-active {
    transition: all 0.5s ease-in;
}

.dropdown-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.dropdown-enter-from {
    transform: translateY(-10px);
    opacity: 0;
}

.dropdown-leave-to {
    transform: translateY(-10px);
    opacity: 0;
}
</style>
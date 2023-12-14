<template>
    <header class="header">
        <div class="header__wrapper">
            <div class="row no-gutters">
                <div class="col-lg-6 align-self-center">
                    <HeaderMenu/>
                </div>
                <div class="col-lg-4 align-self-center">
                    <HeaderActions/>
                </div>
                <div class="col-lg-2 align-self-center text-right">
                    <HeaderFunctions/>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
import HeaderMenu from "@/components/Header/HeaderMenu.vue";
import HeaderActions from "@/components/Header/HeaderActions.vue";
import HeaderFunctions from "@/components/Header/HeaderFunctions.vue";

export default {
    name: "TheHeader",
    components: {
        HeaderFunctions,
        HeaderActions,
        HeaderMenu
    }
};
</script>

<style>
</style>
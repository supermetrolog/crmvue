<template>
    <div class="not-found">
        <div class="not-found__container">
            <div class="row">
                <div class="col-12 text-center">
                    <h1>404</h1>
                </div>
                <div class="col-12 text-center">
                    <h4 class="item_1">Страница не найдена</h4>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "NotFound",
};
</script>

<style lang="scss" scoped>
.not-found {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-family: Arial;
}

h1 {
    font-size: 6rem;
}

h4 {
    font-size: 1rem;
    text-transform: uppercase;
}
</style>
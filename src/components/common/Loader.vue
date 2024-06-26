<template>
    <div class="loader">
        <div class="loader__container">
            <Spinner />
        </div>
    </div>
</template>

<script>
import Spinner from '@/components/common/Spinner.vue';

export default {
    name: 'Loader',
    components: { Spinner }
};
</script>

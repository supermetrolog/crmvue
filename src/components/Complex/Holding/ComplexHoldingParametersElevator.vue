<template>
    <li class="object-equipment">
        <!--        <span v-if="crane.crane_type">{{ crane.type.title }}</span>-->
        <!--        <span v-if="crane.crane_capacity"> / {{ crane.crane_capacity }} тонн</span>-->
        <!--        <span v-if="crane.crane_location"> / {{ crane.location.title }} </span>-->
        <!--        <span v-if="crane.crane_hook_height"> / до крюка {{ crane.crane_hook_height }} м </span>-->
        <!--        <span v-if="crane.crane_condition"> / {{ crane.crane_condition }} </span>-->
    </li>
</template>

<script>
export default {
    name: 'ComplexHoldingParametersElevator',
    props: {
        elevator: Object
    }
};
</script>

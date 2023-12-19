<template>
    <li class="object-equipment">
        <span v-if="crane.crane_type">{{ crane.type.title }}</span>
        <span v-if="crane.crane_capacity"> / {{ crane.crane_capacity }} тонн</span>
        <span v-if="crane.crane_location"> / {{ crane.location.title }} </span>
        <span v-if="crane.crane_hook_height"> / до крюка {{ crane.crane_hook_height }} м </span>
        <span v-if="crane.crane_condition"> / {{ crane.crane_condition }} </span>
    </li>
</template>

<script>
export default {
    name: 'ComplexHoldingParametersCrane',
    props: {
        crane: Object
        // id: Number,
        // title: {
        //     type: [String]
        // },
        // object_id: Number,
        // photo: Array,
        // crane_capacity: Number,
        // crane_type: Number,
        // crane_location: Number,
        // crane_beam: Number,
        // crane_beams_amount: Number,
        // crane_span: Number,
        // crane_hoisting: Number,
        // crane_controls: Array,
        // crane_hooks: Number,
        // crane_hook_height: Number,
        // crane_condition: Number,
        // crane_supervision: Number,
        // crane_documents: {
        //     type: [Number, Array]
        // },
        // description: String,
        // activity: Number,
        // order_row: Number,
        // deleted: Number,
        // publ_time: Number,
        // last_update: Number,
        // state: Number,
        // beam: Number,
        // beamAmount: Number,
        // hoisting: Number,
        // location: {
        //     id: Number,
        //     title: String
        // },
        // type: {
        //     id: Number,
        //     title: String
        // },
        // controls: {
        //     type: [Number, Object, Array]
        // }
    }
};
</script>

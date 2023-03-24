<template>
    <div class="ObjectAbout">
        <Tabs :options="{ useUrlFragment: false }">
            <Tab name="О комплексе">
                <div class="ObjectAbout-info">
                    <PropertyList :title="'Площади'">
                        <PropertyListItem v-for="(prop, idx) in testLists[0]" :key="prop.name + idx" :name="prop.name"
                            :value="prop.value" :unit="prop.unitType" />
                    </PropertyList>
                    <PropertyList :title="'Коммуникации'">
                        <PropertyListItem v-for="(prop, idx) in testLists[1]" :key="prop.name + idx" :name="prop.name"
                            :value="prop.value" :unit="prop.unitType" />
                    </PropertyList>
                    <PropertyList :title="'Безопасность'">
                        <PropertyListItem v-for="(prop, idx) in testLists[2]" :key="prop.name + idx" :name="prop.name"
                            :value="prop.value" :unit="prop.unitType" />
                    </PropertyList>
                    <PropertyList :title="['Ж/Д на территории', 'Инфраструктура']">
                        <template #0>
                            <PropertyListItem v-for="(prop, idx) in testLists[3]" :key="prop.name + idx" :name="prop.name"
                                :value="prop.value" :unit="prop.unitType" />
                        </template>
                        <template #1>
                            <PropertyListItem v-for="(prop, idx) in testLists[4]" :key="prop.name + idx" :name="prop.name"
                                :value="prop.value" :unit="prop.unitType" />
                        </template>
                    </PropertyList>
                </div>
            </Tab>
            <Tab name="План Территории">
                <div>123</div>
            </Tab>
            <Tab name="Презентации">
                <div>
                    123
                </div>
            </Tab>
            <Tab name="Документы">
                <div>
                    123
                </div>
            </Tab>
        </Tabs>
    </div>
</template>

<script>
import PropertyListItem from '../../common/property-list/property-list-item/PropertyListItem.vue'
import PropertyList from '../../common/property-list/PropertyList.vue'
import './styles.scss'
export default {
    name: 'ObjectAbout',
    components: { PropertyList, PropertyListItem },
    props: {},
    data() {
        return {
            testLists: [
                [
                    { name: 'S - участка общая', value: 449750, unitType: 1 },
                    { name: 'S - строений в комплексе', value: 449750, unitType: 2 },
                    { name: 'Управляющая компания', value: 449750 },
                ],
                [
                    { name: 'S - участка общая', value: 449750, unitType: 1 },
                    { name: 'S - строений в комплексе', value: 449750, unitType: 2 },
                    { name: 'S - участка общая', value: 449750, unitType: 3 },
                    { name: 'S - участка общая', value: 449750, unitType: 3 },
                    { name: 'S - участка общая', value: 449750, unitType: 3 },
                    { name: 'S - участка общая', value: 449750, unitType: 3 },
                    { name: 'S - участка общая', value: 449750, unitType: 3 },
                    { name: 'S - участка общая', value: 449750, unitType: 3 },
                    { name: 'S - участка общая', value: 449750, unitType: 3 },
                    { name: 'S - участка общая', value: 449750, unitType: 3 },
                    { name: 'S - участка общая', value: 449750, unitType: 3 },
                ],
                [
                    { name: 'S - участка общая', value: 449750, unitType: 1 },
                    { name: 'S - строений в комплексе', value: 449750, unitType: 2 },
                    { name: 'S - участка общая', value: 449750, unitType: 3 },
                    { name: 'S - участка общая', value: 449750, unitType: 3 },
                    { name: 'S - участка общая', value: 449750, unitType: 3 },
                    { name: 'S - участка общая', value: 449750, unitType: 3 },
                ],
                [
                    { name: 'S - участка общая', value: 449750, unitType: 1 },
                    { name: 'S - строений в комплексе', value: 449750, unitType: 2 },
                    { name: 'S - участка общая', value: 449750, unitType: 3 },
                ],
                [
                    { name: 'S - участка общая', value: 449750, unitType: 1 },
                    { name: 'S - строений в комплексе', value: 449750, unitType: 2 },
                    { name: 'S - участка общая', value: 449750, unitType: 3 },
                    { name: 'S - участка общая', value: 449750, unitType: 1 },
                    { name: 'S - строений в комплексе', value: 449750, unitType: 2 },
                    { name: 'S - участка общая', value: 449750, unitType: 3 },
                ],
            ]
        }
    },
    computed: {},
    methods: {}
}
</script>

<style lang="scss" scoped>
.tabs-component-panels {
    padding: 10px;
}
</style>
<template>
    <div class="ObjectAbout">
        <Tabs :options="{ useUrlFragment: false }">
            <Tab name="О комплексе">
                <div class="ObjectAbout-info" id="bebra">
                    <template v-if="aboutList.length > 0">
                        <PropertyList :title="'Площади'">
                            <PropertyListItem v-for="(prop, idx) in aboutList[0]" :key="prop.name + idx" :name="prop.name"
                                :value="prop.value" :unit="prop.unitType" />
                        </PropertyList>
                        <PropertyList :title="'Коммуникации'">
                            <PropertyListItem v-for="(prop, idx) in aboutList[1]" :key="prop.name + idx" :name="prop.name"
                                :value="prop.value" :unit="prop.unitType" />
                        </PropertyList>
                        <PropertyList :title="'Безопасность'">
                            <PropertyListItem v-for="(prop, idx) in aboutList[2]" :key="prop.name + idx" :name="prop.name"
                                :value="prop.value" :unit="prop.unitType" />
                        </PropertyList>
                        <PropertyList :title="['Ж/Д на территории', 'Инфраструктура']">
                            <template #0>
                                <PropertyListItem v-for="(prop, idx) in aboutList[3]" :key="prop.name + idx"
                                    :name="prop.name" :value="prop.value" :unit="prop.unitType" />
                            </template>
                            <template #1>
                                <PropertyListItem v-for="(prop, idx) in aboutList[4]" :key="prop.name + idx"
                                    :name="prop.name" :value="prop.value" :unit="prop.unitType" />
                            </template>
                        </PropertyList>
                    </template>
                    <template v-else>Нет данных</template>
                </div>
            </Tab>
            <Tab name="План Территории">
                <div class="ObjectAbout-info">123</div>
            </Tab>
            <Tab name="Презентации">
                <div class="ObjectAbout-info">
                    123
                </div>
            </Tab>
            <Tab name="Документы">
                <div class="ObjectAbout-info">
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
    props: {
        aboutList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
        }
    },
    computed: {},
    methods: {
    },
}
</script>
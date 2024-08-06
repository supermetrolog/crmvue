<template>
    <div>
        <div v-if="requirements.length" class="d-flex gap-1 flex-wrap">
            <DashboardChip
                v-for="(requirement, key) in requirements"
                :key="key"
                class="d-flex align-items-center"
                :class="requirement.included ? 'dashboard-bg-success-l' : 'dashboard-bg-danger-l'"
            >
                <span>{{ requirement.name }}</span>
                <i
                    class="icon ml-2"
                    :class="requirement.included ? 'fa-regular fa-circle-check' : 'fa-solid fa-ban'"
                ></i>
            </DashboardChip>
        </div>
        <p v-else>Отстуствуют</p>
    </div>
</template>

<script>
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { entityProperties } from '@/const/properties/properties.js';

export default {
    name: 'DashboardCardRequestRequirements',
    components: {
        DashboardChip
    },
    props: {
        request: {
            type: Object,
            required: true
        }
    },
    computed: {
        requirements() {
            const properties = Object.keys(entityProperties.request.parameters).reduce(
                (acc, property) => {
                    if (this.request[property] !== null)
                        acc.push({
                            ...entityProperties.request.parameters[property],
                            included: Boolean(this.request[property])
                        });
                    return acc;
                },
                []
            );

            let trainProperty = null;
            if (this.request.trainLine !== null) {
                trainProperty = { name: 'Ж/Д ветка', included: Boolean(this.request.trainLine) };
                if (trainProperty.included && this.request.trainLineLength)
                    trainProperty.name += ' - ' + this.request.trainLineLength + 'м';
            }

            if (trainProperty) properties.push(trainProperty);

            return properties;
        }
    }
};
</script>

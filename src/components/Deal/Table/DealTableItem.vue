<template>
    <Tr
        class="company-table-item"
        :class="{ CompanyTableOdd: odd, CompanyTableEven: !odd, 'fade-out': deal.isDeleting }"
    >
        <Td class="text-center">
            <p class="mb-1">{{ deal.id }}</p>
            <DealTableItemActions @edit="$emit('edit')" @delete="$emit('delete')" :deal />
        </Td>
        <Td width="100">#{{ deal.request_id }}</Td>
        <Td>
            <CompanyElement
                v-if="deal.company || deal.competitor"
                :company="deal.company ?? deal.competitor"
                :show-counts="false"
            />
            <p v-else class="text-center">—</p>
        </Td>
        <Td width="100">
            <p v-if="deal.offerMix">#{{ deal.offerMix?.visual_id }}</p>
            <p v-else>—</p>
        </Td>
        <Td width="100">
            <WithUnitType v-if="deal.area" :unit-type="unitTypes.SQUARE_METERS">
                {{ formattedArea }}
            </WithUnitType>
            <p v-else>—</p>
        </Td>
        <Td width="100">
            <WithUnitType v-if="deal.floorPrice" :unit-type="unitTypes.RUB">
                {{ formattedFloorPrice }}
            </WithUnitType>
            <p v-else>—</p>
        </Td>
        <Td width="100">
            <p v-if="deal.contractTerm">{{ deal.contractTerm }} мес.</p>
            <p v-else>—</p>
        </Td>
        <Td width="100">
            <Avatar
                v-if="deal.consultant"
                :label="deal.consultant.userProfile.medium_name"
                :src="deal.consultant.userProfile.avatar"
                :size="55"
                class="mx-auto"
            />
            <p v-else class="text-center">—</p>
        </Td>
        <Td width="140">
            <p>{{ formattedDate }}</p>
        </Td>
    </Tr>
</template>

<script setup>
import Tr from '@/components/common/Table/Tr.vue';
import Td from '@/components/common/Table/Td.vue';
import Avatar from '@/components/common/Avatar.vue';
import DealTableItemActions from '@/components/Deal/Table/DealTableItemActions.vue';
import CompanyElement from '@/components/Company/CompanyElement.vue';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import { computed } from 'vue';
import { toNumberFormat } from '@/utils/formatters/number.js';
import { toBeautifulDateFormat } from '@/utils/formatters/date.ts';

defineEmits(['edit', 'delete']);

const props = defineProps({
    deal: {
        type: Object,
        required: true
    },
    odd: Boolean
});

const formattedArea = computed(() => toNumberFormat(props.deal.area));
const formattedFloorPrice = computed(() => toNumberFormat(props.deal.floorPrice));

const formattedDate = computed(() => toBeautifulDateFormat(props.deal.dealDate));
</script>

import axios from 'axios';
import { responseToPaginatedData } from '@/api/helpers/responseToPaginatedData.ts';

export default {
    async fetchComplex(id, params) {
        const query = new URLSearchParams(params).toString();
        const url = query ? `complex/${id}?${query}` : `complex/${id}`;

        const response = await axios.get(url);
        return responseToPaginatedData(response);
    },

    async getComplexWithObjects(complexId) {
        return await this.fetchComplex(complexId, {
            expand: `objects.company.consultant.userProfile,
              objects.objectClassRecord,
              objects.firefightingType,
              objects.location.regionRecord,
            
              objects.company.mainContact.phones,
              objects.company.mainContact.emails,
              objects.company.objects_count,
              objects.company.requests_count,
              
              location.regionRecord,
              location.highwayRecord,
              location.directionRecord,
              location.districtRecord,
              location.districtMoscowRecord,
              location.townRecord.townTypeRecord,
              location.townCentralRecord,
              location.metroRecord,
              location.districtTypeRecord,
              location.districtFormerRecord,
              location.highwayRelevantRecords,
              location.townsRelevantRecords,
              author.userProfile,
              agent.userProfile,
              objects.purposesRecords,
              guardTypes,
              internetTypes,
              waterTypes,
              objects.commercialOffers.dealTypeRecord,
              objects.commercialOffers.consultant.userProfile,
              objects.commercialOffers.summaryBlock,
              objects.commercialOffers.companyRecord.mainContact.phones,
              objects.commercialOffers.companyRecord.mainContact.emails,
              objects.commercialOffers.companyRecord.objects_count,
              objects.commercialOffers.companyRecord.requests_count,
              objects.commercialOffers.blocks.deal,
              objects.floorsRecords.number,
              objects.floorsRecords.parts,
              objects.floorsRecords.floorTypes,
              objects.floorsRecords.parts.floorTypes,
              objects.cranes.controls,
              objects.cranes.state,
              objects.cranes.beam,
              objects.cranes.beamAmount,
              objects.cranes.hoisting,
              objects.cranes.location,
              objects.cranes.type,
              objects.elevatorsRecords.elevatorType
            `
        });
    }
};

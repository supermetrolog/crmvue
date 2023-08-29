import axios from "axios";
import ErrorHandle from "./errors";
import SuccessHandler from "./success";

export default {
    async fetchComplex(id: string, params?: Record<string, string>) {
        const query = new URLSearchParams(params).toString();
        const url = query ? `complex/${id}?${query}` : `complex/${id}`;
        try {
            const response = await axios.get(url);
            return {
                data: SuccessHandler.getData(response),
                pagination: SuccessHandler.getPaginationData(response),
            };
        } catch (e) {
            ErrorHandle.setError(e);
        }
    },
   
    async getComplexWithObjects(complexId: string) {
        return await this.fetchComplex(complexId, {
            expand: `objects.company.consultant.userProfile,
          objects.objectClassRecord,
          objects.firefightingType,
          objects.location.regionRecord,
          objects.company.mainContact.phones,
          objects.company.mainContact.emails,
          location.regionRecord,
          location.highwayRecord,
          location.directionRecord,
          location.districtRecord,
          location.districtMoscowRecord,
          location.townRecord.townTypeRecord,
          location.townCentralRecord,
          location.metroRecord,
          location.districtTypeRecord,
          author.userProfile,
          agent.userProfile,
          objects.purposesRecords,
          guardTypes,
          internetTypes,
          waterTypes,
          objects.commercialOffers.dealTypeRecord,
          objects.commercialOffers.companyRecord.mainContact.phones,
          objects.commercialOffers.companyRecord.mainContact.emails,
          objects.floorsRecords.number,
          objects.floorsRecords.parts,
          objects.floorsRecords.floorTypes,
          objects.cranes.controls,
          objects.cranes.state,
          objects.cranes.beam,
          objects.cranes.beamAmount,
          objects.cranes.hoisting,
          objects.cranes.location,
          objects.cranes.type`
        });
    },
};

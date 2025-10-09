import { BooleanNumber } from '@/types/base';

export type IndustryObjectMiniOffer = {
    id: number;
    deal_type: 1 | 2 | 3 | 4;
    deleted: BooleanNumber;
    status: number;
    is_land: BooleanNumber;
    is_fake: BooleanNumber;
    calc_area_general: string;
    calc_price_safe_pallet: string;
    calc_price_sale: string;
    calc_price_warehouse: string;
    calc_pallet_place: string;
    original_id: number;
    complex_id: number;
    object_id: number;
};

export type IndustryObject = {
    id: number;
    company_id: number;
    complex_id: number;
    thumb: string;
    photo: string[];
    address: string;
    miniOffers?: IndustryObjectMiniOffer[];
    company: object;
    object_class: number;
    object_class_text: string;
};

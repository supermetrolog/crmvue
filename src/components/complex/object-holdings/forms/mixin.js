import Checkbox from "@/components/common/form/Checkbox.vue";
import Textarea from "@/components/common/form/Textarea.vue";
import Radio from "@/components/common/form/Radio.vue";
import Input from "@/components/common/form/Input.vue";
import FileInput from "@/components/common/form/FileInput.vue";
import CheckboxIcons from "@/components/common/form/CheckboxIcons.vue";
import MultiSelect from "@/components/common/form/MultiSelect.vue";
import Submit from "@/components/common/form/Submit.vue";
import Form from "@/components/common/form/Form.vue";
import FormGroup from "@/components/common/form/FormGroup.vue";
import useValidate from "@vuelidate/core";
import {
	feeTypes,
	entryTerritoryTypes,
	facingTypes, gasTypes, guardTypes, internetTypes, landCategoryTypes, landscapeTypes,
	objectClassTypes,
	objectPurposes,
	ownTypes, ownTypesLand, waterTypes
} from "@/const/constTypes";
import {helpers, required} from "@vuelidate/validators";
import {mapActions} from "vuex";
import {yandexmap} from "@/utils/index.js";

export const ObjectForms = {
	components: {Checkbox, Textarea, Radio, Input, FileInput, CheckboxIcons, MultiSelect, Submit, Form, FormGroup},
	data() {
		return {
			loader: false,
			v$: useValidate(),
			selectedCompany: null,
			objectPurposes,
			objectClassTypes,
			facingTypes,
			ownTypesLand,
			landCategoryTypes,
			landscapeTypes,
			entryTerritoryTypes,
			feeTypes,
			waterTypes,
			gasTypes,
			internetTypes,
			guardTypes,
			ownTypes,
			form: {
				address: null,
				company_id: null,
				object_type: [],
				purposes: [],
				area_building: null,
				area_floor_full: null,
				area_mezzanine_full: null,
				area_office_full: null,
				area_tech_full: null,
				object_class: null,
				facing_type: null,
				own_type: null,
				year_build: null,
				year_repair: null,
				cadastral_number: null,
				test_only: null,
				land_use_restrictions: null,
				area_field_full: null,
				land_length: null,
				land_width: null,
				own_type_land: null,
				land_category: null,
				landscape_type: null,
				cadastral_number_land: null,
				first_line: null,
				field_allow_usage: null,
				power: null,
				power_value: null,
				heating_central: null,
				sewage_central: null,
				sewage_central_value: null,
				sewage_rain: null,
				water: null,
				water_value: null,
				water_type: null,
				gas: null,
				gas_value: null,
				gas_type: null,
				steam: null,
				steam_value: null,
				phone_line: null,
				internet: null,
				internet_type: null,
				guard: null,
				guard_type: null,
				video_control: null,
				access_control: null,
				security_alert: null,
				barrier: null,
				fence_around_perimeter: null,
				railway: null,
				railway_value: null,
				entry_territory: null,
				entry_territory_type: null,
				entrance_type: null,
				parking_car: null,
				parking_car_value: null,
				parking_lorry: null,
				parking_lorry_value: null,
				parking_truck: null,
				parking_truck_value: null,
				canteen: null,
				hostel: null,
				description: null,
				layouts: [],
				layoutsList: [],
				panoramas: [],
				panoramasList: [],
				presentations: [],
				presentationsList: [],
				ownerShipDocuments: [],
				ownerShipDocumentsList: [],
				photos: [],
				photosList: [],

			},
		}
	},
	validations() {
		return {
			form: {
				address: {
					required: helpers.withMessage("заполните поле", required),
				},
				company_id: {
					required: helpers.withMessage("заполните поле", required),
				},
			}
		}
	},
	methods: {
		...mapActions([
			"SEARCH_COMPANIES",
		]),
		onSubmit() {
			console.log("SUBMIT");
		},
		onChangeAddress() {
			console.log("CHANGE ADDRESS")
		},
		async onChangeCompany() {
			console.log("CHANGE COMPANY")
		},
		async searchCompany() {
			return ["ОАО Тореадор", "ЗАО ИнкЛомМет"]
		},
		async searchAddress(query) {
			return await yandexmap.getAddress(query);
		},
		selectObjectType(isSelected, type) {
			this.form.object_type = this.form.object_type.filter(
				(item) => item !== type
			);
			if (isSelected) {
				this.form.object_type.push(type);
			}
		},
	},
}
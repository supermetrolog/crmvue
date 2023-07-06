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
export const ComplexForms = {
	components: {Checkbox, Textarea, Radio, Input, FileInput, CheckboxIcons, MultiSelect, Submit, Form, FormGroup},
	data() {
		return {
			loader: false,
			v$: useValidate(),
		}
	},
	methods: {
		onSubmit() {
			console.log("SUBMIT");
		},
		deleteEmptyFields(object) {
			for (const key in object) {
				if (Object.hasOwnProperty.call(object, key)) {
					const value = object[key];
					if (
						value === null ||
						value === "" ||
						(Array.isArray(value) && !value.length)
					) {
						delete object[key];
					}
				}
			}
		},
	},
}
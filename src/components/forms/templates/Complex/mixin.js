import Checkbox from "@/components/forms/Checkbox.vue";
import Textarea from "@/components/forms/Textarea.vue";
import Radio from "@/components/forms/Radio.vue";
import Input from "@/components/forms/Input.vue";
import FileInput from "@/components/forms/FileInput.vue";
import CheckboxIcons from "@/components/forms/CheckboxIcons.vue";
import MultiSelect from "@/components/forms/MultiSelect.vue";
import Submit from "@/components/forms/Submit.vue";
import Form from "@/components/forms/Form.vue";
import FormGroup from "@/components/forms/FormGroup.vue";
import useValidate from "@vuelidate/core";
export const ComplexFormMixin = {
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
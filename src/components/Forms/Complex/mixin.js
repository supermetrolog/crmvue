import Checkbox from '@/components/common/Forms/Checkbox.vue';
import Textarea from '@/components/common/Forms/Textarea.vue';
import Radio from '@/components/common/Forms/Radio.vue';
import Input from '@/components/common/Forms/Input.vue';
import FileInput from '@/components/common/Forms/FileInput.vue';
import CheckboxIcons from '@/components/common/Forms/CheckboxIcons.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import Submit from '@/components/common/Forms/FormSubmit.vue';
import Form from '@/components/common/Forms/Form.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import useValidate from '@vuelidate/core';

export const ComplexFormMixin = {
    components: {
        Checkbox,
        Textarea,
        Radio,
        Input,
        FileInput,
        CheckboxIcons,
        MultiSelect,
        Submit,
        Form,
        FormGroup
    },
    data() {
        return {
            loader: false,
            v$: useValidate()
        };
    },
    methods: {
        onSubmit() {
            console.log('SUBMIT');
        },
        normalizeForm(params) {
            params.forEach(param => {
                if (!Array.isArray(this.form[param])) this.form[param] = [];
            });
        }
    }
};

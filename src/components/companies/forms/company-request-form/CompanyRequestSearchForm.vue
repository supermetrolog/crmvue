<template>
  <div class="company-request-search-form">
    <Form class="autosize" @submit="onSubmit">
      <FormGroup class="mb-2">
        <Input
          v-model="form.all"
          label="Поиск"
          placeholder="название компании, ID компании, ФИО брокера, ФИО контакта, телефон"
          class="col-12 main-input pr-1"
          @keydown.enter="onSubmit"
        />
      </FormGroup>
      <FormGroup>
        <a
          href="#"
          @click.prevent="extraVisible = !extraVisible"
          class="text-primary"
        >
          фильтры
          <span class="badge badge-danger" v-if="filterCount">
            {{ filterCount }}
          </span>
          <i class="fas fa-angle-down" v-if="!extraVisible"></i>
          <i class="fas fa-angle-up" v-else></i>
        </a>
      </FormGroup>
      <div v-show="extraVisible">
        <FormGroup class="mb-2">
          <MultiSelect
            v-model="form.consultant_id"
            label="Консультант"
            class="col-4 pr-1"
            :options="
              async () => {
                return await FETCH_CONSULTANT_LIST();
              }
            "
          />
          <Input
            v-model="form.dateStart"
            label="Дата от"
            class="col-2 pr-1"
            type="date"
          />
          <Input
            v-model="form.dateEnd"
            label="Дата до"
            class="col-2"
            type="date"
          />
        </FormGroup>
        <FormGroup class="mb-2">
          <CheckboxIcons
            v-model="form.objectTypes"
            label="Тип объекта"
            extraLabel="склад"
            class="col-2 pr-2"
            :options="objectTypeListWareHouse"
          />
          <CheckboxIcons
            v-model="form.objectTypes"
            extraLabel="производство"
            class="col-2 mt-4 pr-2"
            :options="objectTypeListProduction"
          />
          <CheckboxIcons
            v-model="form.objectTypes"
            extraLabel="участок"
            class="col-2 mt-4 pr-2"
            :options="objectTypeListPlot"
          />
          <Radio
            v-model="form.status"
            :options="activePassiveOptions"
            :unselectMode="true"
            label="Статус"
            class="col-2 pr-1"
          />
          <div class="col-2 align-self-center">
            <button
              class="btn btn-warning btn-large"
              @click.prevent="resetForm"
            >
              Сбросить
            </button>
          </div>
        </FormGroup>
        <FormGroup class="mb-2">
          <Input
            v-model="form.rangeMinArea"
            maska="##########"
            label="S пола (м^2)"
            placeholder="От:"
            class="col-3 pr-1"
          >
            <Input
              v-model="form.rangeMaxArea"
              maska="##########"
              placeholder="До:"
              class="col-12 p-0 pt-1"
            />
          </Input>
          <Input
            v-model="form.rangeMinPricePerFloor"
            maska="##########"
            placeholder="От:"
            label="Цена за пол (м^2/год)"
            class="col-3 pr-1"
          >
            <Input
              v-model="form.rangeMaxPricePerFloor"
              maska="##########"
              placeholder="До:"
              class="col-12 p-0 pt-1"
            />
          </Input>
          <Input
            v-model="form.rangeMinCeilingHeight"
            maska="##########"
            label="Высота потолков"
            placeholder="От:"
            class="col-3 pr-1"
          >
            <Input
              v-model="form.rangeMaxCeilingHeight"
              maska="##########"
              placeholder="До:"
              class="col-12 p-0 pt-1"
            />
          </Input>
          <Input
            v-model="form.maxDistanceFromMKAD"
            maska="###"
            label="Удаленность от МКАД"
            class="col-3"
          />
        </FormGroup>
      </div>
    </Form>
  </div>
</template>

<script>
import Form from "@/components/common/form/Form.vue";
import FormGroup from "@/components/common/form/FormGroup.vue";
import Input from "@/components/common/form/Input.vue";
import Radio from "@/components/common/form/Radio.vue";
import MultiSelect from "@/components/common/form/MultiSelect.vue";
import CheckboxIcons from "@/components/common/form/CheckboxIcons.vue";
import { ActivePassive, ObjectTypeList } from "@/const/Const.js";
import { SearchFormMixin } from "@/components/common/mixins.js";
export default {
  mixins: [SearchFormMixin],
  name: "CompanyRequestSearchForm",
  components: {
    Form,
    FormGroup,
    Input,
    Radio,
    MultiSelect,
    CheckboxIcons,
  },
  data() {
    return {
      activePassiveOptions: ActivePassive.get("param"),
      objectTypeListWareHouse: ObjectTypeList.get("warehouse"),
      objectTypeListProduction: ObjectTypeList.get("production"),
      objectTypeListPlot: ObjectTypeList.get("plot"),
    };
  },
  defaultFormProperties: {
    all: null,
    status: null,
    consultant_id: null,
    dateStart: null,
    dateEnd: null,
    objectTypes: [],
    rangeMinArea: null,
    rangeMaxArea: null,
    rangeMinPricePerFloor: null,
    rangeMaxPricePerFloor: null,
    rangeMinCeilingHeight: null,
    rangeMaxCeilingHeight: null,
    maxDistanceFromMKAD: null,
  },
  methods: {
    async setQueryFields() {
      this.form = { ...this.form, ...this.$route.query };
      if (this.form.objectTypes && !Array.isArray(this.form.objectTypes)) {
        this.form.objectTypes = [this.form.objectTypes];
      }
      let array = [];
      this.form.objectTypes.forEach((item) => {
        array.push(+item);
      });
      this.form.objectTypes = array;
      let query = { ...this.form };
      this.deleteEmptyFields(query);
      await this.$router.replace({ query });
    },
  },
};
</script>

<style>
</style>
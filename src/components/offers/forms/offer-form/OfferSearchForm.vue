<template>
  <div class="company-request-search-form">
    <Form class="autosize px-5" @submit="onSubmit">
      <FormGroup class="mb-2">
        <Input
          v-model="form.all"
          label="Поиск"
          placeholder="ID, адрес, собственник, телефон, ФИО"
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
      <div v-if="extraVisible">
        <FormGroup class="mb-2">
          <MultiSelect
            v-model="form.agent_id"
            label="Консультант"
            class="col-4 pr-1"
            :options="
              async () => {
                return await FETCH_CONSULTANT_LIST();
              }
            "
          />

          <MultiSelect
            v-model="form.deal_type"
            label="Тип сделки"
            class="col-2 pr-1"
            :options="dealTypeList"
          />
          <Input
            v-model="form.rangeMaxDistanceFromMKAD"
            maska="###"
            placeholder="не более"
            label="Удаленность от МКАД"
            class="col-3 pr-1"
          />
          <Input
            v-model="form.rangeMinElectricity"
            placeholder="не менее"
            maska="##########"
            label="Электричесвто (квт)"
            class="col-3"
          />
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
            label="Цена (продажи, аренды, о-х)"
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
        </FormGroup>
        <FormGroup class="mb-2">
          <Radio
            v-model="form.class"
            class="col-2 pr-1"
            label="Классы"
            :options="objectClassList"
            :unselectMode="true"
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
import { SearchFormMixin } from "@/components/common/mixins.js";
import { mapActions } from "vuex";
import { DealTypeList, ObjectClassList } from "@/const/Const.js";
export default {
  mixins: [SearchFormMixin],
  name: "OfferSearchForm",
  components: {
    Form,
    FormGroup,
    Input,
    MultiSelect,
    Radio,
  },
  data() {
    return {
      dealTypeList: DealTypeList.get("param"),
      objectClassList: ObjectClassList.get("param"),
    };
  },
  defaultFormProperties: {
    all: null,
    rangeMinElectricity: null,
    rangeMaxDistanceFromMKAD: null,
    deal_type: null,
    agent_id: null,
    rangeMaxArea: null,
    rangeMinArea: null,
    rangeMaxPricePerFloor: null,
    rangeMinPricePerFloor: null,
    rangeMinCeilingHeight: null,
    rangeMaxCeilingHeight: null,
    class: null,
  },
  methods: {
    ...mapActions(["FETCH_CONSULTANT_LIST"]),
    async setQueryFields() {
      this.form = { ...this.form, ...this.$route.query };
      let query = { ...this.form };
      this.deleteEmptyFields(query);
      await this.$router.replace({ query });
    },
  },
};
</script>

<style>
</style>
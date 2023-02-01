<template>
  <CompanyBoxLayout class="CompanyBoxLogs" :class="'grid-b'">
    <template #header>
      <span>Лог работы с {{ headerTitle }}</span>
    </template>
    <template #content>
      <CompanyLogsList :logs="logs" />
      <Form class="CompanyBoxLogs-form" @submit="onSubmit(timelineStep)">
        <FormGroup>
          <Textarea
            class="col-12"
            placeholder="Добавьте комментарий по процессу"
          />
          <Submit class="mt-1" buttonClasses="btn-primary"> добавить </Submit>
          <!-- <div class="col-12 mt-4" v-if="loader">
            <Loader class="center small py-2 no-absolute" />
          </div> -->
        </FormGroup>
      </Form>
    </template>
  </CompanyBoxLayout>
</template>

<script>
import "./styles.scss";
import CompanyLogsList from "./logsList/CompanyLogsList.vue";
import Textarea from "../../../common/form/Textarea.vue";
import Form from "../../../common/form/Form.vue";
import FormGroup from "../../../common/form/FormGroup.vue";
import Submit from "../../../common/form/Submit.vue";
import CompanyBoxLayout from "../CompanyBoxLayout.vue";
export default {
  name: "CompanyBoxLogs",
  components: {
    CompanyBoxLayout,
    Submit,
    FormGroup,
    Form,
    Textarea,
    CompanyLogsList,
  },
  props: {
    logs: {
      type: Array,
      default: () => [],
    },
    company: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  computed: {
    headerTitle() {
      return this.company.nameRu || this.company.nameEng;
    },
  },
};
</script>
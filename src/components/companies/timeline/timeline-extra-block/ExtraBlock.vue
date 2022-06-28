<template>
  <div class="extra-block">
    <div class="row no-gutters inner scroller">
      <div class="col-12 mt-4">
        <div class="row no-gutters">
          <div class="col-12">
            <h4 class="mt-0 mb-1 text-center">Комментарии</h4>
            <Accordion>
              <AccordionItem
                v-for="timelineStep in TIMELINE.timelineSteps"
                :key="timelineStep.id"
                :title="
                  timelineStepOptions[timelineStep.number][1].name +
                  ` (${timelineStep.timelineActionComments.length})`
                "
                :titleClasses="
                  'badge-' + timelineStepOptions[timelineStep.number][1].class
                "
                :openByDefault="step.id == timelineStep.id"
                :disabled="step.id == timelineStep.id"
              >
                <Comments :data="timelineStep.timelineActionComments" />
                <Form
                  v-if="step.id == timelineStep.id"
                  ref="form"
                  class="mb-3"
                  @submit="onSubmit(step)"
                >
                  <FormGroup>
                    <Textarea
                      class="col-12"
                      v-model="form.comment"
                      :v="v$.form.comment"
                      placeholder="введите комментарий"
                    />
                    <Input
                      class="col-12 mt-1"
                      v-model="form.startDate"
                      label="Уведомить"
                      type="datetime-local"
                    />
                    <Submit
                      class="col-12 mt-1"
                      buttonClasses="btn-primary"
                      :disabled="disabled"
                      v-if="!loader"
                    >
                      добавить
                    </Submit>
                    <div class="col-12 mt-4" v-if="loader">
                      <Loader class="center small py-2 no-absolute" />
                    </div>
                  </FormGroup>
                </Form>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { Timeline } from "@/const/Const";
import Form from "@/components/common/form/Form";
import Textarea from "@/components/common/form/Textarea";
import Input from "@/components/common/form/Input";
import Submit from "@/components/common/form/Submit";
import FormGroup from "@/components/common/form/FormGroup";
import Accordion from "@/components/common/accordion/Accordion";
import AccordionItem from "@/components/common/accordion/AccordionItem";
import Comments from "./Comments.vue";
import useValidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import moment from "moment";
import api from "@/api/api.js";
export default {
  name: "ExtraBlock",
  components: {
    Form,
    Textarea,
    Input,
    Submit,
    FormGroup,
    Accordion,
    AccordionItem,
    Comments,
  },
  data() {
    return {
      v$: useValidate(),
      loader: false,
      timelineStepOptions: Timeline.get("param"),
      form: {
        comment: null,
        startDate: null,
      },
    };
  },
  props: {
    step: {
      type: Object,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(["TIMELINE_COMMENTS", "TIMELINE", "THIS_USER"]),
  },
  validations() {
    return {
      form: {
        comment: {
          required: helpers.withMessage("введите комментарий", required),
        },
      },
    };
  },
  methods: {
    scrollToForm() {
      let options = {
        behavior: "smooth",
        block: "center",
      };
      console.warn(this.$refs.form.$el);
      this.$refs.form.$el.scrollIntoView(options);
    },
    async onSubmit(step) {
      this.v$.$validate();
      if (this.v$.form.$error) {
        return;
      }
      this.loader = true;
      let comment = this.form.comment;
      let startDate = moment(this.form.startDate).format("YYYY-MM-DD HH:mm:ss");
      if (this.form.startDate) {
        comment = `<p class="text-center d-block">Уведомление<p>`;
        comment += `<p class="d-block">Комментарий: <b>${this.form.comment}</b><p>`;
        comment += `<p class="d-block">Дата: <b>${startDate}</b><p>`;
        await api.calendar.createCalendar({
          title: this.form.comment,
          startDate: startDate,
          consultant_id: this.THIS_USER.id,
        });
      }
      step.newActionComments = [
        {
          timeline_id: step.timeline_id,
          timeline_step_id: step.id,
          timeline_step_number: step.number,
          title: this.THIS_USER.userProfile.short_name,
          comment: comment,
          type: 3,
        },
      ];
      this.$emit("createComment", step, false, () => (this.loader = false));
      this.form.comment = null;
      this.v$.$reset();
    },
  },
  mounted() {
    setTimeout(() => this.scrollToForm(), 1000); //Из за анимации нужно подождать 500 мс чтобы элемент появился
  },
  watch: {
    step() {
      setTimeout(() => this.scrollToForm(), 300);
    },
  },
};
</script>

<style>
</style>
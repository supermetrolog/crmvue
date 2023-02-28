<template>
  <div class="CallerLog">
    <Accordion>
      <AccordionItem
        v-for="issueSection in issueSections"
        :key="issueSection.id"
        :id="issueSection.id"
        :title="issueSection.name"
      >
        <div class="CallerLog-section">
          <CallerQuestions
            :questionsList="issueSection.questionsList"
            :sectionId="issueSection.id"
            @questionClicked="onQuestionClicked"
          />
          <div class="CallerLog-chat">
            <ChatList
              @infinite="load"
              @chatMounted="refreshChat"
              :items="this.COMPANY_LOGS"
              :key="this.company.id"
            />
          </div>
          <CallerForm
            :replyText="replyItem?.text"
            @cancelReply="onCancelReply"
          />
        </div>
      </AccordionItem>
    </Accordion>
  </div>
</template>

<script>
import CallerQuestions from "./components/caller-questions/CallerQuestions.vue";
import CallerForm from "./components/caller-form/CallerForm.vue";
import { mapActions, mapGetters } from "vuex";
import ChatList from "../../chat/chat-list/ChatList.vue";
import AccordionItem from "../../accordion/AccordionItem.vue";
import Accordion from "../../accordion/Accordion.vue";
import "./styles.scss";

export default {
  name: "CallerLog",
  components: {
    Accordion,
    AccordionItem,
    ChatList,
    CallerQuestions,
    CallerForm,
  },
  props: {
    call: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      issueSections: [
        {
          id: 1,
          name: "ПЛОЩАДЬ. Аренда",
          questionsList: [
            { id: 1, text: "Есть ли сейчас свободная площадь?" },
            { id: 2, text: "Освободится ли в течение года?" },
            { id: 3, text: "Уточнить ценообразование аренды" },
            {
              id: 4,
              text: "Консультировать в случае существенных расхождений по цене",
            },
            {
              id: 5,
              text: "Предложить короткую аналитику рынка, либо отправить бесплатную подборку объектов",
            },
          ],
        },
        {
          id: 2,
          name: "ПЛОЩАДЬ. Продажа",
          questionsList: [
            { id: 1, text: "Есть ли сейчас площади на продажу?" },
            {
              id: 2,
              text: "Если не продает, уточнить почему. Поговорить о возможной цене его объекта.",
            },
            {
              id: 3,
              text: "Если продает, уточнить почему. Не устраивает экономика? Пересдадим, изучим, улучшим!",
            },
            {
              id: 4,
              text: "Рассказать про ситуацию на рынке, кол-во предложений на рынке. Обсудить конкурентов.",
            },
            {
              id: 5,
              text: "Консультировать в случае существенных расхождений по цене.",
            },
            {
              id: 6,
              text: "Предложить короткую аналитику рынка, либо бесплатную подборку объектов",
            },
          ],
        },
      ],
      replyItem: null,
    };
  },
  computed: {
    ...mapGetters(["THIS_USER", "COMPANY_LOGS"]),
    company() {
      let company =
        this.call.phoneFrom?.contact.company ||
        this.call.phoneTo?.contact.company;
      return company;
    },
  },
  methods: {
    ...mapActions(["FETCH_COMPANY_LOGS", "REFRESH_COMPANY_LOGS"]),
    async load($state, id = this.company.id) {
      console.log("loading more...", id);
      try {
        const response = await this.FETCH_COMPANY_LOGS(id);
        if (response === "complete") {
          $state.complete();
        }
        if (response === "loaded") {
          $state.loaded();
        }
      } catch (error) {
        $state.error();
      }
    },
    onQuestionClicked(questionId, sectionId) {
      this.replyItem = this.issueSections
        .find((item) => item.id == sectionId)
        .questionsList.find((item) => item.id == questionId);
    },
    onCancelReply() {
      console.log(123);
      this.replyItem = null;
    },
    refreshChat() {
      this.REFRESH_COMPANY_LOGS();
      this.replyItem = null;
    },
  },
};
</script>
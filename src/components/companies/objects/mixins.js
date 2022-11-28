import api from "@/api/api";
import Objects from "./Objects.vue";
import ObjectsList from "./ObjectsList.vue";
import ObjectsSearch from "@/components/offers/forms/offer-form/OfferSearchForm";
import Pagination from "@/components/common/Pagination";
import { mapActions, mapGetters } from "vuex";
import { notify } from "@kyvg/vue3-notification";
import crypto from "crypto";
import CommentWithAutoSetComment, {
  AlreadySendOffersComment,
  DONE_COMMENT_TYPE,
  OffersNotFoundComment,
  SendOffersComment,
} from "../timeline/comments/commenst";
export const MixinObject = {
  components: {
    Objects,
    ObjectsList,
  },
  data() {
    return {
      selectedObjects: [],
      preventStepObjects: [],
      loader: false,
      allObjectsLoader: false,
      viewMode: true,
    };
  },
  computed: {
    ...mapGetters([
      "TIMELINE",
      "THIS_USER",
      "COMPANY_CONTACTS",
      "COMPANY_REQUESTS",
    ]),
    preventStepTimelineObjects() {
      if (!this.TIMELINE) return null;
      console.error("PREVENT UPDATE");
      const preventStep = this.TIMELINE.timelineSteps.find(
        (item) => item.number == this.step.number - 1
      );
      return preventStep.timelineStepObjects;
    },
    submittedObjects() {
      return this.step.timelineStepObjects.map((object) => object.offer);
    },
    notSubmittedObjects() {
      return this.preventStepObjects.filter(
        (object) =>
          !this.submittedObjects.find(
            (item) => item.original_id == object.original_id
          )
      );
    },
    buttons() {
      return [
        {
          btnClass: "primary",
          btnVisible: false,
          defaultBtn: true,
          disabled: !this.selectedObjects.length || this.disabled,
          title: "Сохранить",
          text: "Готово",
          emited_event: "done",
          withWayOfSending: false,
          classes: "col-2",
        },
        {
          btnClass: "danger",
          btnVisible: false,
          defaultBtn: true,
          btnActive: this.step.negative,
          disabled: this.disabled,
          title:
            "В случае нахождения более подходящих предложений вам придет уведомление!",
          text: "Нет подходящих",
          emited_event: "negative",
          withWayOfSending: false,
          classes: "col-2 ml-1",
        },
      ];
    },
    currentRequest() {
      if (Array.isArray(this.COMPANY_REQUESTS)) {
        return this.COMPANY_REQUESTS.find(
          (item) => item.id == this.$route.query.request_id
        );
      }
      return false;
    },
  },
  methods: {
    ...mapActions(["UPDATE_STEP"]),
    async alreadySent({ wayOfSending, contactForSendMessage, contacts }) {
      const sendClientFlag = false;

      const letterID = await this.realSendObjects(
        wayOfSending,
        sendClientFlag,
        contacts
      );
      if (!letterID) return;

      this.step.newActionComments = [
        new AlreadySendOffersComment(
          this.step,
          this.selectedObjects.length,
          contactForSendMessage,
          wayOfSending,
          letterID
        ),
      ];
      this.sendObjectsHandler();
    },
    async send({
      message,
      wayOfSending,
      contactForSendMessage,
      contacts,
      subject,
    }) {
      const sendClientFlag = true;

      const letterID = await this.realSendObjects(
        wayOfSending,
        sendClientFlag,
        contacts,
        message,
        subject
      );
      if (!letterID) return;

      this.step.newActionComments = [
        new SendOffersComment(
          this.step,
          this.selectedObjects.length,
          contactForSendMessage,
          wayOfSending,
          letterID
        ),
      ];
      this.sendObjectsHandler();
    },
    async realSendObjects(
      wayOfSending,
      sendClientFlag,
      contacts,
      comment = null,
      subject = null
    ) {
      let notifyOptions = {
        group: "app",
        type: "error",
        duration: 5000,
        title: "Ошибка",
        text: "Не удалось отправить объекты!",
      };
      this.loader = true;
      this.allObjectsLoader = true;

      const objectsParams = [];
      this.selectedObjects.forEach((item) => {
        objectsParams.push({
          object_id: item.object_id,
          original_id: item.original_id,
          type_id: item.type_id,
          consultant: this.THIS_USER.userProfile.full_name,
        });
      });

      const isSuccessfuly = await api.timeline.sendObjects({
        contacts,
        shipping_method: sendClientFlag ? 1 : 0,
        offers: objectsParams,
        body: comment,
        ways: wayOfSending,
        sendClientFlag,
        subject,
      });

      this.loader = false;
      this.allObjectsLoader = false;

      if (!isSuccessfuly) {
        notify(notifyOptions);
        return isSuccessfuly;
      }
      return isSuccessfuly;
    },
    getDoneComment(step) {
      return [new CommentWithAutoSetComment(step, DONE_COMMENT_TYPE)];
    },
    done() {
      this.step.newActionComments = this.getDoneComment(this.step);
      this.sendObjectsHandler();
    },
    negative() {
      console.log("NEGATIVE");
      this.selectNegative();
    },
    changeViewMode(value) {
      console.log("ChangeViewMode", value);
      this.viewMode = value;
    },
    reset() {
      console.log("RESET");
      this.selectedObjects = [];
    },
    getNegativeComment(step) {
      return [new OffersNotFoundComment(step)];
    },
    selectNegative() {
      let data = this.step;
      data.click_negative = true;
      if (data.negative) {
        data.negative = 0;
        data.newActionComments = [];
      } else {
        data.negative = 1;
        data.newActionComments = this.getNegativeComment(data);
      }
      this.clickUpdateStep(data);
    },
    beforeSend(data) {
      data.negative = 0;
      data.additional = 0;
      data.status = 1;
      data.timelineStepObjects = [];
    },

    normalizeObjectsData(data) {
      this.selectedObjects.map((item) => {
        data.timelineStepObjects.push({
          timeline_step_id: data.id,
          object_id: item.object_id,
          offer_id: item.original_id,
          complex_id: item.complex_id,
          type_id: item.type_id,
          comment: item.comment,
          timeline_id: data.timeline_id,
          class_name: item.class_name,
          deal_type_name: item.deal_type_name,
          visual_id: item.visual_id,
          address: item.address,
          area: item.calc_area_general,
          price: (() => {
            if (item.deal_type == 1 || item.deal_type == 4) {
              return item.calc_price_warehouse;
            } else if (item.deal_type == 2) {
              return item.calc_price_sale;
            } else if (item.deal_type == 3) {
              return item.calc_price_safe_pallet;
            }
          })(),
          image: item.thumb,
        });
      });
    },
    offerUrl(offer) {
      const baseUrl = "https://pennylane.pro/complex/";
      let url = baseUrl + offer.complex_id;
      if (offer.generalOffersMix) {
        url += "?offer_id=[" + offer.generalOffersMix.original_id + "]";
      } else {
        url += "?offer_id=[" + offer.original_id + "]";
      }
      return url;
    },
    sendObjectsHandler() {
      let data = {
        ...this.step,
      };
      this.beforeSend(data);
      this.normalizeObjectsData(data);
      this.sendObjects(data);
    },
    afterSend() {},
    async sendObjects(data) {
      this.loader = true;
      if (await this.UPDATE_STEP(data)) {
        this.afterSend();
        this.updatedObjects(data, () =>
          this.includeStepDataInObjectsData(this.preventStepObjects)
        );
        this.reset();
      }
      this.loader = false;
    },
    select(object) {
      console.log("SELECT", object);
      this.selectedObjects.push(object);
    },
    selectOnlyOne(object) {
      this.selectedObjects = [object];
    },
    unSelect(object) {
      console.log("UNSELECT");
      this.selectedObjects = this.selectedObjects.filter(
        (item) => item.id != object.id
      );
    },
    addComment(object, comment) {
      console.log("ADD COMMENT", object, comment);
      this.selectedObjects.map((item) => {
        if (item.id == object.id) {
          item.comment = comment;
          return item;
        }
      });
      console.log("ADD COMMENT", this.selectedObjects);
    },
    async getPreventStepObjects() {
      this.loader = true;
      const objects = [];
      this.preventStepTimelineObjects.forEach((item) => {
        if (item.offer && item.offer.id) {
          objects.push(item.offer);
        } else {
          objects.push({ ...item, noOffer: true });
        }
      });
      this.includeStepDataInObjectsData(objects);
      this.preventStepObjects = objects;
      this.loader = false;
    },
    includeStepDataInObjectsData(data) {
      console.error("data", data);
      if (!this.TIMELINE) return data;

      this.step.timelineStepObjects.forEach((item) => {
        let comments = [];
        this.TIMELINE.timelineSteps.forEach((step) => {
          let result = step.timelineStepObjects.find(
            (thisObject) => thisObject.object_id == item.object_id
          );
          if (result && result.comments.length) {
            comments.push(...result.comments);
          }
        });
        data.map((object) => {
          if (item.object_id == object.original_id) {
            object.duplicate_count = item.duplicate_count;
            object.comments = item.comments;
            object.allComments = comments;
            // object.comment = item.comment;
            return object;
          }
        });
      });
      return data;
    },
  },
  mounted() {
    this.getPreventStepObjects();
  },
};
export const MixinWithSendLetter = {
  mixins: [MixinObject],
  data() {
    return {
      sendObjectsModalVisible: false,
    };
  },
  methods: {
    openSendObjectsModal() {
      this.sendObjectsModalVisible = true;
    },
    closeSendObjectsModal() {
      this.sendObjectsModalVisible = false;
    },
    // Переопределено из миксина
    afterSend() {
      this.closeSendObjectsModal();
    },
    sendOffers(params) {
      this.send(params);
    },
    alreadySentOffers(params) {
      this.alreadySent(params);
    },
  },
};
export const MixinAllObject = {
  mixins: [MixinWithSendLetter],
  components: {
    ObjectsSearch,
    Pagination,
  },
  data() {
    return {
      allObjects: [],
      currentPage: 1,
      pagination: null,
      searchMode: false,
      searchParams: null,
      allObjectsLoader: false,
      controllPanelHeight: 0,
      barVisible: false,
      waitHash: null,
      contactForSendMessage: [],
    };
  },
  computed: {
    ...mapGetters(["COMPANY_REQUESTS", "FAVORITES_OFFERS"]),
    buttons() {
      return [
        {
          btnClass: "success",
          btnVisible: false,
          defaultBtn: true,
          disabled: !this.selectedObjects.length || this.disabled,
          title: "Отправить презентации с объектами клиенту",
          text:
            "Отправить" +
            (this.selectedObjects.length
              ? ` (${this.selectedObjects.length})`
              : ""),
          emited_event: "send",
          withWayOfSending: false,
          classes: "",
        },
        {
          btnClass: "primary",
          btnVisible: false,
          defaultBtn: true,
          disabled: !this.selectedObjects.length || this.disabled,
          title: "Уже отправил предложения другим способом",
          text:
            "Отметить как отправленные" +
            (this.selectedObjects.length
              ? ` (${this.selectedObjects.length})`
              : ""),
          emited_event: "alreadySent",
          withWayOfSending: true,
          classes: "ml-1",
        },
        {
          btnClass: "danger",
          btnVisible: false,
          defaultBtn: true,
          btnActive: this.step.negative,
          disabled: this.disabled,
          title: "Отправить презентации с объектами клиенту",
          text: "Нет подходящих",
          emited_event: "negative",
          withWayOfSending: false,
          classes: "ml-1",
        },
      ];
    },
  },
  methods: {
    ...mapActions(["SEARCH_FAVORITES_OFFERS"]),
    async getAllObjects(query = {}, withLoader = true) {
      this.allObjectsLoader = withLoader;
      let hash = crypto
        .createHash("sha256")
        .update(JSON.stringify(query))
        .digest("base64");
      this.waitHash = hash;
      query = {
        type_id: [1, 2, 3],
        page: this.currentPage,
        "per-page": 20,
        expand: "object,offer,generalOffersMix.offer,comments",
        timeline_id: this.TIMELINE.id,
        ...query,
      };
      if (!this.FAVORITES_OFFERS.length) {
        await this.SEARCH_FAVORITES_OFFERS();
      }
      if (query.favorites) {
        query.original_id = this.FAVORITES_OFFERS.map(
          (item) => item.original_id
        );
        query.object_id = this.FAVORITES_OFFERS.map((item) => item.object_id);
        query.complex_id = this.FAVORITES_OFFERS.map((item) => item.complex_id);
      }
      const data = await api.companyObjects.searchOffers(query);

      if (hash == this.waitHash) {
        this.includeStepDataInObjectsData(data.data);
        this.setAllObjects(data);
      }
      this.allObjectsLoader = false;
    },
    async getPreventStepObjects() {
      this.loader = true;
      const objects = [];
      this.step.timelineStepObjects.forEach((item) => {
        if (item.offer && item.offer.id) {
          objects.push(item.offer);
        } else {
          objects.push({ ...item, noOffer: true });
        }
      });
      this.includeStepDataInObjectsData(objects);
      this.preventStepObjects = objects;
      this.loader = false;
    },
    setAllObjects(data) {
      if (
        Array.isArray(this.allObjects) &&
        Array.isArray(data.data) &&
        this.currentPage > 1
      ) {
        this.allObjects = this.allObjects.concat(data.data);
      } else {
        this.allObjects = data.data;
      }

      this.pagination = data.pagination;
    },
    async search(params, withLoader = true) {
      this.searchParams = params;
      this.searchMode = true;
      this.returnCurrentPageToFirst();
      this.getAllObjects(params, withLoader);
    },
    async searchAllObjects(params) {
      this.allObjectsLoader = true;
      await this.getAllObjects(params);
      this.allObjectsLoader = false;
    },
    loadMore() {
      this.incrimentCurrentPage();
      if (this.searchMode) {
        this.searchAllObjects(this.searchParams);
      } else {
        this.getAllObjects();
      }
    },
    incrimentCurrentPage() {
      this.currentPage++;
      if (this.searchParams && this.searchParams.page) {
        this.searchParams.page++;
      }
    },
    returnCurrentPageToFirst() {
      this.currentPage = 1;
    },
    favorites() {
      this.barVisible = !this.barVisible;
    },
    getData() {
      this.getAllObjects();
    },
    select(object) {
      console.log("SELECT", object);
      this.selectedObjects.push(object);
    },
  },
  mounted() {
    this.getData();
  },
};

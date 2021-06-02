<template>
  <div id="simple-calendar">
    <div class="calendar-controls">
      <div class="box">
        <div class="calendar-message">
          {{ message }}
        </div>
        <div class="field">
          <label class="label">Название</label>
          <div class="control">
            <input v-model="newItemTitle" class="input" type="text" />
          </div>
        </div>

        <div class="field">
          <label class="label">Начало события</label>
          <div class="control">
            <input
              v-model="newItemStartDate"
              class="input"
              type="datetime-local"
              :max="newItemEndDate"
            />
          </div>
        </div>

        <div class="field">
          <label class="label">Конец события</label>
          <div class="control">
            <input
              v-model="newItemEndDate"
              class="input"
              type="datetime-local"
              :min="newItemStartDate"
            />
          </div>
        </div>
        <div class="add-event" v-if="!selectedItem">
          <button
            class="btn btn-primary btn-large add-event"
            @click="clickAddItem"
          >
            Добавить событие
          </button>
        </div>
        <div class="update-event row no-gutters" v-else>
          <div class="col-9 pr-2">
            <button class="btn btn-success btn-large" @click="clickUpdateItem">
              Изменить
            </button>
          </div>
          <div class="col-3">
            <button class="btn btn-danger" @click="clickDeleteItem">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>

        <!-- <div class="calendar-item-info">
          <input type="text" class="update-item" />
        </div> -->
      </div>
    </div>
    <div class="calendar-parent">
      <calendar-view
        :items="this.EVENTS"
        :show-times="true"
        :show-date="showDate"
        :time-format-options="{ hour: 'numeric', minute: '2-digit' }"
        :enable-drag-drop="true"
        :disable-past="disablePast"
        :disable-future="disableFuture"
        :date-classes="myDateClasses"
        :display-period-uom="displayPeriodUom"
        :display-period-count="displayPeriodCount"
        :starting-day-of-week="startingDayOfWeek"
        :class="themeClasses"
        :period-changed-callback="periodChanged"
        :current-period-label="useTodayIcons ? 'icons' : ''"
        :displayWeekNumbers="displayWeekNumbers"
        :enable-date-selection="true"
        :selection-start="selectionStart"
        :selection-end="selectionEnd"
        @date-selection-start="setSelection"
        @date-selection="setSelection"
        @date-selection-finish="finishSelection"
        @drop-on-date="onDrop"
        @click-date="onClickDay"
        @click-item="onClickItem"
      >
        <template #header="{ headerProps }">
          <calendar-view-header
            :header-props="headerProps"
            @input="setShowDate"
          />
        </template>
      </calendar-view>
    </div>
  </div>
</template>
<script>
// Load CSS from the published version
import "vue-simple-calendar/dist/style.css";
import "vue-simple-calendar/static/css/default.css";
import "vue-simple-calendar/static/css/holidays-us.css";
// Load CSS from the local repo
//require("../../vue-simple-calendar/static/css/default.css")
//require("../../vue-simple-calendar/static/css/holidays-us.css")
import {
  CalendarView,
  CalendarViewHeader,
  CalendarMath,
} from "vue-simple-calendar"; // published version
//} from "../../vue-simple-calendar/src/components/bundle.js" // local repo
import moment from "moment";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "SimpleCalendar",
  components: {
    CalendarView,
    CalendarViewHeader,
  },
  data() {
    return {
      /* Show the current month, and give it some fake items to show */
      showDate: this.thisMonth(1),
      message: "",
      startingDayOfWeek: 1,
      disablePast: false,
      disableFuture: false,
      displayPeriodUom: "month",
      displayPeriodCount: 1,
      displayWeekNumbers: false,
      showTimes: true,
      selectionStart: null,
      selectionEnd: null,
      newItemTitle: "",
      newItemStartDate: "",
      newItemEndDate: "",
      useDefaultTheme: true,
      useHolidayTheme: true,
      useTodayIcons: true,
      selectedItem: null,
      dateFormat: "YYYY-MM-DDTHH:mm:ss",
      items: [
        {
          id: 0,
          startDate: "2021-05-05 16:30:00",
          endDate: "2021-05-05 16:40:00",
        },
        {
          id: 1,
          startDate: this.thisMonth(15, 18, 32),
        },
        {
          id: 2,
          startDate: this.thisMonth(15),
          title: "Single-day item with a long title",
        },
        {
          id: 3,
          startDate: this.thisMonth(7, 9, 25),
          endDate: this.thisMonth(10, 16, 30),
          title: "Multi-day item with a long title and times",
        },
        {
          id: 4,
          startDate: this.thisMonth(20),
          title: "My Birthday!",
          classes: "birthday",
          url: "https://en.wikipedia.org/wiki/Birthday",
        },
        {
          id: 5,
          startDate: this.thisMonth(5),
          endDate: this.thisMonth(12),
          title: "Multi-day item",
          classes: "purple",
        },
        {
          id: 6,
          startDate: this.thisMonth(29),
          title: "Same day 1",
        },
        {
          id: 7,
          startDate: this.thisMonth(29),
          title: "Same day 2",
          classes: "orange",
        },
        {
          id: 8,
          startDate: this.thisMonth(29),
          title: "Same day 3",
        },
        {
          id: 9,
          startDate: this.thisMonth(29),
          title: "Same day 4",
          classes: "orange",
        },
        {
          id: 10,
          startDate: this.thisMonth(29),
          title: "Same day 5",
        },
        {
          id: 11,
          startDate: this.thisMonth(29),
          title: "Same day 6",
          classes: "orange",
        },
        {
          id: 12,
          startDate: this.thisMonth(29),
          title: "Same day 7",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["EVENTS"]),
    userLocale() {
      return CalendarMath.getDefaultBrowserLocale;
    },
    dayNames() {
      return CalendarMath.getFormattedWeekdayNames(this.userLocale, "long", 0);
    },
    themeClasses() {
      return {
        "theme-default": this.useDefaultTheme,
        "holiday-us-traditional": this.useHolidayTheme,
        "holiday-us-official": this.useHolidayTheme,
      };
    },
    myDateClasses() {
      // This was added to demonstrate the dateClasses prop. Note in particular that the
      // keys of the object are `yyyy-mm-dd` ISO date strings (not dates), and the values
      // for those keys are strings or string arrays. Keep in mind that your CSS to style these
      // may need to be fairly specific to make it override your theme's styles. See the
      // CSS at the bottom of this component to see how these are styled.
      const o = {};
      const theFirst = this.thisMonth(1);
      const ides = [2, 4, 6, 9].includes(theFirst.getMonth()) ? 15 : 13;
      const idesDate = this.thisMonth(ides);
      o[CalendarMath.isoYearMonthDay(idesDate)] = "ides";
      o[CalendarMath.isoYearMonthDay(this.thisMonth(21))] = [
        "do-you-remember",
        "the-21st",
      ];
      return o;
    },
  },
  mounted() {
    this.newItemStartDate = moment(CalendarMath.today()).format(
      this.dateFormat
    );
    this.newItemEndDate = moment(CalendarMath.today()).format(this.dateFormat);
  },
  beforeMount() {
    this.FETCH_CALENDAR_EVENTS();
  },
  methods: {
    ...mapActions([
      "FETCH_CALENDAR_EVENTS",
      "ADD_EVENT",
      "UPDATE_EVENT",
      "DELETE_EVENT",
    ]),
    periodChanged() {
      // range, eventSource) {
      // Demo does nothing with this information, just including the method to demonstrate how
      // you can listen for changes to the displayed range and react to them (by loading items, etc.)
      //console.log(eventSource)
      //console.log(range)
    },
    thisMonth(d, h, m) {
      const t = new Date();
      return new Date(t.getFullYear(), t.getMonth(), d, h || 0, m || 0);
    },
    onClickDay(d) {
      this.selectionStart = null;
      this.selectionEnd = null;
      this.newItemTitle = null;
      this.newItemStartDate = moment(d).format(this.dateFormat);
      this.newItemEndDate = moment(d).format(this.dateFormat);
      this.selectedItem = null;
      this.message = `Вы выбрали: ${d.toLocaleDateString()}`;
    },
    onClickItem(e) {
      this.selectionStart = null;
      this.selectionEnd = null;
      this.newItemStartDate = moment(e.startDate).format(this.dateFormat);
      this.newItemEndDate = moment(e.endDate).format(this.dateFormat);
      this.newItemTitle = e.title;
      this.selectedItem = e;
      this.message = `Вы выбрали: ${e.title}`;
    },
    setShowDate(d) {
      this.message = `Changing calendar view to ${d.toLocaleDateString()}`;
      this.showDate = d;
    },
    setSelection(dateRange) {
      this.selectionEnd = dateRange[1];
      this.selectionStart = dateRange[0];
    },
    finishSelection(dateRange) {
      this.setSelection(dateRange);
      this.newItemStartDate = moment(this.selectionStart).format(
        this.dateFormat
      );
      this.newItemEndDate = moment(this.selectionEnd).format(this.dateFormat);
      this.newItemTitle = null;
      this.selectedItem = null;
      this.message = `Вы выделили: ${this.selectionStart.toLocaleDateString()} -${this.selectionEnd.toLocaleDateString()}`;
    },
    onDrop(item, date) {
      this.message = `You dropped ${item.id} on ${date.toLocaleDateString()}`;
      // Determine the delta between the old start date and the date chosen,
      // and apply that delta to both the start and end date to move the item.
      const eLength = CalendarMath.dayDiff(item.startDate, date);
      item.originalItem.startDate = CalendarMath.addDays(
        item.startDate,
        eLength
      );
      item.originalItem.endDate = CalendarMath.addDays(item.endDate, eLength);
    },
    clickAddItem() {
      this.ADD_EVENT({
        startDate: this.newItemStartDate,
        endDate: this.newItemEndDate,
        title: this.newItemTitle,
        id: "e" + Math.random().toString(36).substr(2, 10),
      }).then(() => {
        this.newItemTitle = null;
        this.message = "Вы добавили новое событие!";
      });
    },
    clickUpdateItem() {
      this.UPDATE_EVENT({
        id: this.selectedItem.id,
        startDate: this.newItemStartDate,
        endDate: this.newItemEndDate,
        title: this.newItemTitle,
      }).then(() => {
        this.message = "Вы изменили событие";
      });
    },
    clickDeleteItem() {
      this.DELETE_EVENT(this.selectedItem.id).then(() => {
        this.selectedItem = null;
        this.newItemTitle = null;
        this.message = "Вы удалили событие";
      });
    },
  },
};
</script>

<style lang="scss">
@import "../../assets/styles/var.scss";
html,
body {
  height: 100%;
}
#simple-calendar {
  display: flex;
  flex-direction: row;
  font-family: Calibri, sans-serif;
  width: 100%;
  min-height: 100%;
}
.calendar-controls {
  margin-right: 1rem;
  min-width: 14rem;
  max-width: 14rem;
  input {
    width: 100%;
  }
  button {
    margin-top: 17px;
    i {
      font-size: 15px;
    }
  }
}
.calendar-parent {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-x: hidden;
  overflow-y: hidden;
  max-height: 80vh;
  background-color: white;
}
/* For long calendars, ensure each week gets sufficient height. The body of the calendar will scroll if needed */
.cv-wrapper.period-month.periodCount-2 .cv-week,
.cv-wrapper.period-month.periodCount-3 .cv-week,
.cv-wrapper.period-year .cv-week {
  min-height: 6rem;
}
.cv-wrapper {
  .cv-header {
    background-color: unset;
    text-transform: capitalize;
    &-nav {
      button {
        background-color: unset !important;
        border: unset;
        color: $color-dark;
        font-weight: bold;
      }
    }
    &-day {
      background-color: unset !important;
      font-size: 22px;
      font-weight: bold;
    }
  }
  .cv-weeks {
    .cv-day {
      &.lastInstance:not(.future) {
        background-color: unset !important;
        color: lighten($color_grey, 20);
      }
      &.future.outsideOfMonth {
        background-color: unset !important;
        color: lighten($color_grey, 20);
      }
    }
  }
  .cv-item {
    background-color: $color_primary !important;
    // border: 1px solid $color_primary !important;
    border: unset;
    border-radius: 2px !important;
    color: $color_light !important;
    font-size: 18px !important;
    font-weight: 700 !important;
    &::before {
      color: $color_light;
    }
    .startTime {
      color: $color_light;
      margin-right: 8px;
    }
  }
}
.cv-item.continued {
  &::before {
    color: $color_light !important;
  }
}
.cv-item.toBeContinued {
  &::after {
    color: $color_light !important;
  }
}
</style>
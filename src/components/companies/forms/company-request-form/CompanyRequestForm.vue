<template>
  <div class="company-form company-request-form">
    <Modal
      :title="!formdata ? 'Создание запроса' : 'Изменение запроса'"
      @close="clickCloseModal"
      class="normal"
    >
      <form @submit.prevent="submitForm">
        <div class="company-form-container p-3">
          <Loader class="center" v-if="loader" />

          <div class="main-input-list">
            <div class="input-group row no-gutters">
              <div class="col-5 pr-2">
                <label class="input-label">Регионы</label>
                <Multiselect
                  v-model="form.regions"
                  mode="multiple"
                  :options="regionList"
                />
                <div class="extraField" v-if="form.regions.includes(1)">
                  <label class="input-label">Направления</label>
                  <div class="checkbox-group no-input pb-2 text-center">
                    <div
                      class="d-inline-block mr-1"
                      v-for="direction of directionList"
                      :key="direction[0]"
                    >
                      <input
                        class="checkbox ml-0 d-none"
                        type="checkbox"
                        v-model="form.directions"
                        :value="direction[0]"
                        :id="'checkbox-direction' + direction[0]"
                      />
                      <label
                        class="
                          checkbox-label
                          direction
                          mb-1
                          justify-content-center
                        "
                        :class="{
                          active: form.directions.includes(direction[0]),
                        }"
                        :for="'checkbox-direction' + direction[0]"
                      >
                        <span class="align-self-center">
                          {{ direction[1] }}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-4 pr-2">
                <label class="input-label required" title="Тип сделки">
                  Тип сделки
                </label>
                <Multiselect
                  v-model="form.dealType"
                  :options="dealTypeList"
                  :canDeselect="false"
                  title="Тип сделки"
                  @change="v$.form.dealType.$touch"
                  @close="this.isOpenDealTypeSelect = true"
                  @open="this.isOpenDealTypeSelect = false"
                  @click="test($refs.dealTypeSelect, 'DEALTYPE')"
                  ref="dealTypeSelect"
                  :class="{
                    invalid: v$.form.dealType.$error,
                    valid: v$.form.dealType.$dirty && !v$.form.dealType.$error,
                  }"
                />
                <div
                  class="col-12 text-center error-container pt-1 pb-0"
                  v-if="v$.form.dealType.$error"
                >
                  <span>{{ v$.form.dealType.$errors[0].$message }}</span>
                </div>
                <div class="extraField" v-if="form.regions.includes(0)">
                  <label class="input-label">Округа Москвы</label>
                  <div class="checkbox-group no-input pb-2 text-center">
                    <div
                      class="d-inline-block mr-1"
                      v-for="district of districtList"
                      :key="district[0]"
                    >
                      <input
                        class="checkbox ml-0 d-none"
                        type="checkbox"
                        v-model="form.districts"
                        :value="district[0]"
                        :id="'checkbox-district' + district[0]"
                      />
                      <label
                        class="
                          checkbox-label
                          district
                          mb-1
                          justify-content-center
                        "
                        :class="{
                          active: form.districts.includes(district[0]),
                        }"
                        :for="'checkbox-district' + district[0]"
                      >
                        <span class="align-self-center">
                          {{ district[1] }}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-3 text-right">
                <label class="input-label d-block" title="Срочный запрос">
                  Срочный запрос
                </label>
                <input
                  class="checkbox large d-block ml-auto"
                  type="radio"
                  @click="
                    form.expressRequest ? (form.expressRequest = null) : ''
                  "
                  v-model="form.expressRequest"
                  value="1"
                  title="Срочный запрос"
                />
              </div>
            </div>
            <div class="input-group row no-gutters">
              <div class="col-4 pr-2">
                <label class="input-label required" title="Удаленность от МКАД">
                  Удаленность от МКАД (км)
                </label>
                <input
                  v-model.number="form.distanceFromMKAD"
                  title="Удаленность от МКАД"
                  @input="v$.form.distanceFromMKAD.$touch"
                  v-maska="'###'"
                  :disabled="form.distanceFromMKADnotApplicable"
                  :class="{
                    invalid: v$.form.distanceFromMKAD.$error,
                    valid:
                      v$.form.distanceFromMKAD.$dirty &&
                      !v$.form.distanceFromMKAD.$error &&
                      !form.distanceFromMKADnotApplicable,
                  }"
                />
                <div
                  class="col-12 text-center error-container pt-1 pb-0"
                  v-if="v$.form.distanceFromMKAD.$error"
                >
                  <span>{{
                    v$.form.distanceFromMKAD.$errors[0].$message
                  }}</span>
                </div>
                <div class="row no-gutters mt-1">
                  <div class="col-2">
                    <input
                      class="checkbox large d-inline"
                      type="radio"
                      @click="
                        form.distanceFromMKADnotApplicable
                          ? (form.distanceFromMKADnotApplicable = null)
                          : ''
                      "
                      v-model="form.distanceFromMKADnotApplicable"
                      value="1"
                      title="Неприменимо"
                      id="distanceFromMKADnotApplicable"
                    />
                  </div>
                  <div class="col-9 pl-2">
                    <label
                      class="input-label additional"
                      for="distanceFromMKADnotApplicable"
                    >
                      Неприменимо - регион или Москва
                    </label>
                  </div>
                </div>
              </div>
              <div class="col-2 text-center pr-2">
                <label class="input-label d-block" title="Только 1 этаж">
                  Только 1 этаж
                </label>
                <input
                  class="checkbox large d-block m-auto"
                  @click="
                    form.firstFloorOnly ? (form.firstFloorOnly = null) : ''
                  "
                  type="radio"
                  v-model.number="form.firstFloorOnly"
                  value="1"
                  title="Только 1 этаж"
                />
              </div>
              <div class="col-3 pr-2 text-center">
                <label class="input-label required">Высота потолков (м)</label>
                <input
                  v-model="form.minCeilingHeight"
                  title="От:"
                  @input="v$.form.minCeilingHeight.$touch"
                  v-maska="'##########'"
                  placeholder="От:"
                  :class="{
                    invalid: v$.form.minCeilingHeight.$error,
                    valid:
                      v$.form.minCeilingHeight.$dirty &&
                      !v$.form.minCeilingHeight.$error,
                  }"
                />
                <div
                  class="col-12 text-center error-container pt-1 pb-0"
                  v-if="v$.form.minCeilingHeight.$error"
                >
                  <span>{{
                    v$.form.minCeilingHeight.$errors[0].$message
                  }}</span>
                </div>
                <input
                  class="mt-1"
                  v-model="form.maxCeilingHeight"
                  title="До:"
                  @input="v$.form.maxCeilingHeight.$touch"
                  v-maska="'##########'"
                  placeholder="До:"
                  :class="{
                    invalid: v$.form.maxCeilingHeight.$error,
                    valid:
                      v$.form.maxCeilingHeight.$dirty &&
                      !v$.form.maxCeilingHeight.$error,
                  }"
                />

                <div
                  class="col-12 text-center error-container pt-1 pb-0"
                  v-if="v$.form.maxCeilingHeight.$error"
                >
                  <span>{{
                    v$.form.maxCeilingHeight.$errors[0].$message
                  }}</span>
                </div>
              </div>
              <div class="col-3 text-center">
                <label class="input-label required">S - пола (кв^2)</label>
                <input
                  v-model="form.minArea"
                  title="От:"
                  @input="v$.form.minArea.$touch"
                  v-maska="'##########'"
                  placeholder="От:"
                  :class="{
                    invalid: v$.form.minArea.$error,
                    valid: v$.form.minArea.$dirty && !v$.form.minArea.$error,
                  }"
                />
                <div
                  class="col-12 text-center error-container pt-1 pb-0"
                  v-if="v$.form.minArea.$error"
                >
                  <span>{{ v$.form.minArea.$errors[0].$message }}</span>
                </div>
                <input
                  class="mt-1"
                  v-model="form.maxArea"
                  title="До:"
                  @input="v$.form.maxArea.$touch"
                  v-maska="'##########'"
                  placeholder="До:"
                  :class="{
                    invalid: v$.form.maxArea.$error,
                    valid: v$.form.maxArea.$dirty && !v$.form.maxArea.$error,
                  }"
                />

                <div
                  class="col-12 text-center error-container pt-1 pb-0"
                  v-if="v$.form.maxArea.$error"
                >
                  <span>{{ v$.form.maxArea.$errors[0].$message }}</span>
                </div>
              </div>
            </div>
            <div class="input-group row no-gutters">
              <div class="col-4 pr-2">
                <label class="input-label">Классы</label>
                <div class="checkbox-group pb-2">
                  <div
                    class="d-inline-block mr-2"
                    v-for="objectClass of objectClassList"
                    :key="objectClass[0]"
                  >
                    <input
                      class="checkbox ml-0 mr-1 middle"
                      type="checkbox"
                      v-model="form.objectClasses"
                      :value="objectClass[0]"
                      :id="'checkbox' + objectClass[0]"
                    />
                    <label
                      class="checkbox-label middle"
                      :for="'checkbox' + objectClass[0]"
                      >{{ objectClass[1] }}</label
                    >
                  </div>
                </div>
              </div>

              <div class="col-6 pr-2">
                <label class="input-label">Тип ворот</label>
                <div class="checkbox-group pb-2">
                  <div
                    class="d-inline-block mr-1"
                    v-for="gateTypes of gateTypeList"
                    :key="gateTypes[0]"
                  >
                    <input
                      class="checkbox ml-0"
                      type="checkbox"
                      v-model="form.gateTypes"
                      :value="gateTypes[0]"
                      :id="'checkbox-gate-type' + gateTypes[0]"
                    />
                    <label
                      class="checkbox-label"
                      :for="'checkbox-gate-type' + gateTypes[0]"
                      >{{ gateTypes[1] }}</label
                    >
                  </div>
                </div>
              </div>
              <div class="col-2">
                <label class="input-label required">Отапливаемый</label>
                <div
                  class="checkbox-group pb-2 text-center"
                  :class="{
                    invalid: v$.form.heated.$error,
                  }"
                >
                  <input
                    class="checkbox ml-0"
                    type="radio"
                    v-model="form.heated"
                    value="1"
                    id="radio-0"
                  />
                  <label class="checkbox-label" for="radio-0">да</label>
                  <input
                    class="checkbox"
                    type="radio"
                    v-model="form.heated"
                    value="0"
                    id="radio-1"
                  />
                  <label class="checkbox-label" for="radio-1">нет</label>
                </div>
                <div
                  class="col-12 text-center error-container pt-1 pb-0"
                  v-if="v$.form.heated.$error"
                >
                  <span>{{ v$.form.heated.$errors[0].$message }}</span>
                </div>
              </div>
            </div>
            <div class="input-group row no-gutters">
              <div class="col-3 pr-2">
                <label class="input-label d-block" title="Только антипыль">
                  Только антипыль
                </label>
                <input
                  class="checkbox large d-block"
                  type="radio"
                  @click="form.antiDustOnly ? (form.antiDustOnly = null) : ''"
                  v-model.number="form.antiDustOnly"
                  value="1"
                  title="Только антипыль"
                />
              </div>

              <div class="col-3 pr-2">
                <label class="input-label" title="Электричество">
                  Электричество (квт)
                </label>
                <input
                  v-model="form.electricity"
                  title="Электричество"
                  v-maska="'########'"
                />
              </div>
              <div class="col-3 text-center">
                <label class="input-label">Наличие кранов</label>
                <div class="checkbox-group pb-2">
                  <input
                    class="checkbox m-auto"
                    type="radio"
                    v-model="form.haveCranes"
                    value="1"
                    id="radio-have-cranes-0"
                  />
                  <label class="checkbox-label" for="radio-have-cranes-0">
                    да
                  </label>
                  <input
                    class="checkbox"
                    type="radio"
                    v-model="form.haveCranes"
                    value="0"
                    id="radio-have-cranes-1"
                  />
                  <label class="checkbox-label" for="radio-have-cranes-1">
                    нет
                  </label>
                </div>
                <div
                  class="col-12 text-center error-container pt-1 pb-0"
                  v-if="v$.form.heated.$error"
                >
                  <span>{{ v$.form.heated.$errors[0].$message }}</span>
                </div>
              </div>
              <div class="col-3">
                <label class="input-label" title="Цена за пол"
                  >Цена за пол (м^2 год)
                </label>
                <input
                  v-model="form.pricePerFloor"
                  title="Цена за пол"
                  v-maska="'########'"
                />
              </div>
            </div>
            <div class="input-group row no-gutters">
              <div class="col-4 pr-2">
                <label class="input-label required" title="Консультант">
                  Консультант
                </label>
                <Multiselect
                  v-model="form.consultant_id"
                  :options="this.CONSULTANT_LIST"
                  :canDeselect="false"
                  title="Тип сделки"
                  @change="v$.form.consultant_id.$touch"
                  @close="this.isOpenConsultantSelect = true"
                  @open="this.isOpenConsultantSelect = false"
                  @click="test($refs.consultantSelect, 'CONSULTANT')"
                  ref="consultantSelect"
                  :class="{
                    invalid: v$.form.consultant_id.$error,
                    valid:
                      v$.form.consultant_id.$dirty &&
                      !v$.form.consultant_id.$error,
                  }"
                />
                <div
                  class="col-12 text-center error-container pt-1 pb-0"
                  v-if="v$.form.consultant_id.$error"
                >
                  <span>{{ v$.form.consultant_id.$errors[0].$message }}</span>
                </div>
              </div>
              <div class="col text-center pr-2">
                <label class="input-label">Ж/Д ветка</label>
                <div class="checkbox-group pb-2">
                  <input
                    class="checkbox m-auto"
                    type="radio"
                    v-model="form.trainLine"
                    value="1"
                    id="radio-trainLine-0"
                  />
                  <label class="checkbox-label" for="radio-trainLine-0">
                    да
                  </label>
                  <input
                    class="checkbox"
                    type="radio"
                    v-model="form.trainLine"
                    value="0"
                    id="radio-trainLine-1"
                  />
                  <label class="checkbox-label" for="radio-trainLine-1">
                    нет
                  </label>
                </div>
              </div>
              <div class="col extraField" v-if="this.form.trainLine == 1">
                <label class="input-label" for="radio-trainLine-1">
                  Длина Ж/Д (м)
                </label>

                <input
                  type="text"
                  v-model="form.trainLineLength"
                  v-maska="'#########'"
                />
              </div>
              <div class="col text-center">
                <label class="input-label">Статус</label>
                <div class="checkbox-group pb-2">
                  <input
                    class="checkbox ml-0"
                    type="radio"
                    v-model.number="form.status"
                    value="1"
                    id="radio-status-0"
                  />
                  <label class="checkbox-label" for="radio-status-0"
                    >Актив</label
                  >
                  <br v-if="this.form.trainLine == 1" />
                  <input
                    class="checkbox ml-2"
                    :class="{ 'ml-0': this.form.trainLine != 1 }"
                    type="radio"
                    v-model.number="form.status"
                    value="0"
                    id="radio-status-1"
                  />
                  <label class="checkbox-label" for="radio-status-1"
                    >Пассив</label
                  >
                </div>
              </div>
            </div>
            <div class="input-group row no-gutters">
              <div class="col-5 pr-2">
                <label class="input-label">Дата переезда</label>
                <input
                  @change="this.form.unknownMovingDate = null"
                  v-model="form.movingDate"
                  type="date"
                  @input="v$.form.movingDate.$touch"
                  :class="{
                    invalid: v$.form.movingDate.$error,
                    valid:
                      v$.form.movingDate.$dirty &&
                      !v$.form.movingDate.$error &&
                      !form.unknownMovingDate,
                  }"
                />
                <div
                  class="col-12 text-center error-container pt-1 pb-0"
                  v-if="v$.form.movingDate.$error"
                >
                  <span>{{ v$.form.movingDate.$errors[0].$message }}</span>
                </div>
                <div class="checkbox-group mt-2">
                  <input
                    class="checkbox ml-0"
                    @click="this.form.movingDate = null"
                    type="radio"
                    v-model="form.unknownMovingDate"
                    value="1"
                    id="radio-unknownMovingDate-0"
                  />
                  <label class="checkbox-label" for="radio-unknownMovingDate-0">
                    нет конкретики по сроку
                  </label>
                  <br />
                  <input
                    class="checkbox ml-0"
                    type="radio"
                    @click="this.form.movingDate = null"
                    v-model="form.unknownMovingDate"
                    value="0"
                    id="radio-unknownMovingDate-1"
                  />
                  <label class="checkbox-label" for="radio-unknownMovingDate-1">
                    рассматривает постоянно
                  </label>
                </div>
              </div>
              <div class="col-7">
                <label class="input-label">Тип объекта</label>
                <div class="row no-gutters">
                  <div class="col-4 pr-1">
                    <div class="row no-gutters">
                      <div class="col-12">
                        <button
                          disabled
                          class="btn btn-light btn-large"
                          :class="{ active: warehouseTypeListVisible }"
                        >
                          склад
                        </button>
                      </div>
                      <div
                        class="col-12 mt-1 text-center"
                        v-if="warehouseTypeListVisible"
                      >
                        <div class="checkbox-group no-input pb-2">
                          <div
                            class="d-inline-block mr-1"
                            v-for="objectType of objectTypeListWareHouse"
                            :key="objectType[0]"
                          >
                            <input
                              class="checkbox ml-0 d-none"
                              type="checkbox"
                              v-model="form.objectTypes"
                              :value="objectType[0]"
                              :id="'checkbox-object-type' + objectType[0]"
                            />
                            <label
                              class="checkbox-label mb-1 justify-content-center"
                              :class="{
                                active: form.objectTypes.includes(
                                  objectType[0]
                                ),
                              }"
                              :for="'checkbox-object-type' + objectType[0]"
                              :title="objectType[1].name"
                            >
                              <i
                                :class="objectType[1].icon"
                                class="align-self-center"
                              ></i>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-4 pr-1 pl-1">
                    <div class="row">
                      <div class="col-12">
                        <button
                          disabled
                          class="btn btn-light btn-large"
                          :class="{ active: productionTypeListVisible }"
                        >
                          производство
                        </button>
                      </div>
                      <div
                        class="col-12 mt-1 text-center"
                        v-if="productionTypeListVisible"
                      >
                        <div class="checkbox-group no-input pb-2">
                          <div
                            class="d-inline-block mr-1"
                            v-for="objectType of objectTypeListProduction"
                            :key="objectType[0]"
                          >
                            <input
                              class="checkbox ml-0 d-none"
                              type="checkbox"
                              v-model="form.objectTypes"
                              :value="objectType[0]"
                              :id="'checkbox-object-type' + objectType[0]"
                            />
                            <label
                              class="checkbox-label mb-1 justify-content-center"
                              :class="{
                                active: form.objectTypes.includes(
                                  objectType[0]
                                ),
                              }"
                              :for="'checkbox-object-type' + objectType[0]"
                              :title="objectType[1].name"
                            >
                              <i
                                :class="objectType[1].icon"
                                class="align-self-center"
                              ></i>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-4 pr-1 pl-1">
                    <div class="row">
                      <div class="col-12">
                        <button
                          disabled
                          class="btn btn-light btn-large"
                          :class="{ active: plotTypeListVisible }"
                        >
                          участок
                        </button>
                      </div>
                      <div
                        class="col-12 text-center mt-1"
                        v-if="plotTypeListVisible"
                      >
                        <div class="checkbox-group no-input pb-2">
                          <div
                            class="d-inline-block mr-1"
                            v-for="objectType of objectTypeListPlot"
                            :key="objectType[0]"
                          >
                            <input
                              class="checkbox ml-0 d-none"
                              type="checkbox"
                              v-model="form.objectTypes"
                              :value="objectType[0]"
                              :id="'checkbox-object-type' + objectType[0]"
                            />
                            <label
                              class="checkbox-label mb-1 justify-content-center"
                              :class="{
                                active: form.objectTypes.includes(
                                  objectType[0]
                                ),
                              }"
                              :for="'checkbox-object-type' + objectType[0]"
                              :title="objectType[1].name"
                            >
                              <i
                                :class="objectType[1].icon"
                                class="align-self-center"
                              ></i>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <label class="input-label mt-3">Описание</label>
                <div class="row no-gutters">
                  <div class="col-12 pr-1">
                    <textarea v-model="form.description"></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row mb-4">
            <div class="col-5 text-center m-auto">
              <input
                v-if="!formdata"
                class="btn btn-success btn-large"
                type="submit"
                value="Создать"
              />
              <input
                v-else
                class="btn btn-success btn-large"
                type="submit"
                value="Сохранить изменения"
              />
            </div>
          </div>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import useValidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import Modal from "@/components/Modal";
import Utils from "@/utils";
import Loader from "@/components/Loader";
import {
  ObjectClassList,
  GateTypeList,
  ObjectTypeList,
  RegionList,
  DirectionList,
  DistrictList,
  DealTypeList,
} from "@/const/Const.js";
import Multiselect from "@vueform/multiselect";
export default {
  name: "CompanyRequestForm",
  components: {
    Modal,
    Multiselect,
    Loader,
  },
  data() {
    return {
      v$: useValidate(),
      objectClassList: ObjectClassList.get("param"),
      gateTypeList: GateTypeList.get("param"),
      objectTypeListWareHouse: ObjectTypeList.get("warehouse"),
      objectTypeListProduction: ObjectTypeList.get("production"),
      objectTypeListPlot: ObjectTypeList.get("plot"),
      regionList: RegionList.get("param"),
      directionList: DirectionList.get("param"),
      districtList: DistrictList.get("param"),
      dealTypeList: DealTypeList.get("param"),
      productionTypeListVisible: true,
      warehouseTypeListVisible: true,
      plotTypeListVisible: true,
      isOpenDealTypeSelect: false,
      isOpenConsultantSelect: false,
      loader: false,
      form: {
        company_id: null,
        id: null,
        dealType: null,
        regions: [],
        expressRequest: null,
        distanceFromMKAD: null,
        distanceFromMKADnotApplicable: null,
        minArea: null,
        maxArea: null,
        minCeilingHeight: null,
        maxCeilingHeight: null,
        firstFloorOnly: null, ///
        objectClasses: [],
        heated: null,
        gateTypes: [],
        antiDustOnly: null,
        electricity: "",
        haveCranes: null,
        trainLine: null,
        trainLineLength: null,
        status: 1, //default
        consultant_id: null,
        description: null,
        pricePerFloor: null,
        objectTypes: [],
        directions: [],
        districts: [],
        movingDate: null,
        unknownMovingDate: null,
      },
    };
  },
  props: {
    formdata: {
      type: Object,
      default: null,
    },
    company_id: {
      type: Number,
      default: null,
    },
  },
  computed: {
    ...mapGetters(["CONSULTANT_LIST"]),
  },
  validations() {
    return {
      form: {
        dealType: {
          required: helpers.withMessage("выберите тип сделки", required),
        },
        distanceFromMKAD: {
          customRequired: helpers.withMessage(
            "Заполните поле",
            this.customRequired
          ),
        },
        minArea: {
          required: helpers.withMessage("Заполните поле", required),
        },
        maxArea: {
          required: helpers.withMessage("Заполните поле", required),
        },
        minCeilingHeight: {
          required: helpers.withMessage("Заполните поле", required),
        },
        maxCeilingHeight: {
          required: helpers.withMessage("Заполните поле", required),
        },
        heated: {
          required: helpers.withMessage("Выберите вариант", required),
        },
        consultant_id: {
          required: helpers.withMessage("Выберите вариант", required),
        },
        movingDate: {
          customRequiredForMovingDate: helpers.withMessage(
            "Заполните поле",
            this.customRequiredForMovingDate
          ),
        },
      },
    };
  },
  methods: {
    ...mapActions([
      "FETCH_CONSULTANT_LIST",
      "CREATE_REQUEST",
      "UPDATE_REQUEST",
    ]),
    async submitForm() {
      this.v$.$validate();
      console.log(this.form);
      if (!this.v$.form.$error) {
        this.regionNormalize();
        this.loader = true;
        if (this.formdata) {
          this.updateRequest();
        } else {
          this.createRequest();
        }
      }
    },
    regionNormalize() {
      if (!this.form.regions.includes(0)) {
        this.form.districts = [];
      }
      if (!this.form.regions.includes(1)) {
        this.form.directions = [];
      }
    },
    async updateRequest() {
      if (await this.UPDATE_REQUEST(this.form)) {
        this.$emit("updated");
        this.loader = false;
        this.clickCloseModal();
      }
    },
    async createRequest() {
      if (await this.CREATE_REQUEST(this.form)) {
        this.$emit("created");
        this.loader = false;

        this.clickCloseModal();
      }
    },
    customRequired(value) {
      if (!this.form.distanceFromMKADnotApplicable) {
        if (value != null) {
          return true;
        }
        return false;
      } else {
        return true;
      }
    },
    customRequiredForMovingDate(value) {
      if (this.form.unknownMovingDate === null) {
        if (value != null) {
          return true;
        }
        return false;
      } else {
        return true;
      }
    },

    clickCloseModal() {
      this.$emit("closeCompanyForm");
    },
    test(ref, selectName) {
      console.log(this.form.regions);
      switch (selectName) {
        case "DEALTYPE":
          if (!this.isOpenDealTypeSelect) {
            ref.open();
            this.isOpenDealTypeSelect = true;
          } else {
            ref.close();
            this.isOpenDealTypeSelect = false;
          }
          break;
        case "CONSULTANT":
          if (!this.isOpenConsultantSelect) {
            ref.open();
            this.isOpenConsultantSelect = true;
          } else {
            ref.close();
            this.isOpenConsultantSelect = false;
          }
          break;
        default:
          break;
      }
    },
  },
  async created() {
    this.loader = true;
    await this.FETCH_CONSULTANT_LIST();
    if (this.formdata) {
      this.form = Utils.normalizeDataForForm(this.formdata);
      console.log(this.form);
    } else {
      this.form.company_id = this.company_id;
    }
    this.loader = false;
  },
  emits: ["closeCompanyForm", "created", "updated"],
};
</script>

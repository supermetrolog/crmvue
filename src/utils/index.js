import { loadYmap } from "vue-yandex-maps";
import crypto from "crypto";
export const yandexmap = {
  settings: {
    apiKey: "59572809-066b-46d5-9e5d-269a65751b84",
    lang: "ru_RU",
    coordorder: "latlong",
    enterprise: false,
    version: "2.1",
  },
  async init() {
    await loadYmap({ ...this.settings, debug: true });
  },
  getObjectsCoords(objects, userLocation) {
    let coords = [];
    coords.push({ original_id: -1, coord: userLocation });
    objects.forEach((object) => {
      let tempObj;
      if (object.offer) {
        tempObj = object.offer;
      } else {
        tempObj = object;
      }
      coords.push({
        original_id: tempObj.original_id,
        coord: [+tempObj.latitude, +tempObj.longitude],
      });
    });
    return coords;
  },
  getDistances(coords) {
    // let minDistances = [];
    // let restCoords = [...coords];
    // restCoords.shift();
    // minDistances.push(coords[0]);

    // coords.forEach((coord) => {
    //   //   let minWay;
    //   let waysArray = restCoords.map((restCoord) => {
    //     window.ymaps.coordSystem.geo.getDistance(
    //       (coord.coord, restCoord.coord) / 1000
    //     );
    //   });

    //   //   minWay = waysArray;
    //   minDistances = waysArray;
    // });
    // console.log(123, "результ");
    // return minDistances;
    let distances = [];
    coords.map((coord, i) => {
      distances.push({ startPoint: coord.original_id, routes: [] });
      coords.map((coordDuplicate, j) => {
        if (i != j) {
          distances[i].routes.push({
            id: coordDuplicate.original_id,
            distance: parseInt(
              window.ymaps.coordSystem.geo.getDistance(
                coord.coord,
                coordDuplicate.coord
              )
            ),
          });
          //   distances[coord.original_id][coordDuplicate.original_id] =
          //   );
          // distances[coord.original_id].push({
          //     betweenCoord: coordDuplicate.original_id,
          //     distance: parseInt(window.ymaps.coordSystem.geo.getDistance(coord.coord, coordDuplicate.coord) / 1000)
          // });
        }
      });
    });
    return distances;
  },
  getMinimumDistance(distances) {
    // if (i < 0) {
    //   return distances;
    // }
    // const startPoint = distances[idx];
    // startPoint.map((distance, index) => {
    //   count += distance;
    //   i--;
    //   this.getMinimumDistance(distances, index, i, count);
    // });
    // console.warn(startPoint, idx, 4, count);
    // // this.getMinimumDistance(startPoint, index, i);
    // // distances.map((item, index) => {
    // //     console.warn(item, index);
    // // });
    // return minimum;

    let resultArray = [];
    function getMin(distances, idx, i = distances.length - 2, count = 0) {
      if (i < 0) {
        return distances;
      }
      const startPoint = distances.find((way) => way.startPoint === idx);
      startPoint.routes.sort((a, b) => {
        return a.distance - b.distance;

        //   this.getMinimumDistance(distances, index, i, count);
      });
      i--;
      count += startPoint.routes[0].distance;
      resultArray.push(startPoint.routes[0]);
      distances = distances.map(function (item) {
        return {
          startPoint: item.startPoint,
          routes: item.routes.filter((r) => r.id !== idx),
        };
      });

      getMin(distances, startPoint.routes[0].id, i, count);
    }
    getMin(distances, -1);
    return resultArray;
  },
  async getOptimizeRoutes(objects, userLocation) {
    console.log(objects, userLocation);
    const coords = await this.getObjectsCoords(objects, userLocation);
    console.log(coords);
    // // console.log(coords, "координаты пришли");
    await this.init();
    const distances = await this.getDistances(coords);
    console.log(distances, "дистанция");
    const minDistance = await this.getMinimumDistance(distances);
    console.log(minDistance, "минималочка");
    return [...minDistance.map((item) => item.id)];
  },
  async findAddress(query) {
    // Геокодируем введённые данные.
    if (!query || !window.ymaps || !window.ymaps.geocode) {
      return [];
    }
    query = "россия " + query;
    let result = [];
    await window.ymaps.geocode(query).then(
      function (res) {
        let obj = res.geoObjects;
        obj.each((item) => {
          result.push(item.getAddressLine());
        });
      },
      function (e) {
        console.error(e);
      }
    );
    return result;
  },
  async getAddress(query, currentAddress = null) {
    await this.init();
    let address = await this.findAddress(query);
    if (currentAddress) {
      address.push(currentAddress);
    }
    return address;
  },
};
export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
export const validatePropogationInput = (fields, name) => {
  let flag = true;
  fields.forEach((item, index) => {
    if (index > 0 && !item[name].length) {
      flag = false;
    }
  });
  return flag;
};
export const validateUrl = (str) => {
  const with_protocol_regex = new RegExp(
    "^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?"
  );

  const regex = new RegExp(
    "^([0-9A-Za-z-\\.@:%_+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?"
  );
  if (!regex.test(str) && !with_protocol_regex.test(str)) {
    return false;
  }
  return true;
};

export const waitHash = (data) => {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(data))
    .digest("base64");
};

export const contains = (target, pattern = []) => {
  let exist = false;
  pattern.forEach((word) => {
    if (!exist) exist = !!target.includes(word);
  });
  return exist;
};

export default {
  normalizeContactsForMultiselect(contacts) {
    let data = [];
    contacts.map((contact) => {
      let array = [];

      contact.phones.map((item) => {
        array.push({
          label: item.phone,
          value: {
            contact_id: item.contact_id,
            id: item.id,
            type: 0,
            value: item.phone,
          },
        });
      });
      contact.emails.map((item) => {
        array.push({
          label: item.email,
          value: {
            contact_id: item.contact_id,
            id: item.id,
            type: 1,
            value: item.email,
          },
        });
      });
      data.push({
        label: contact.type ? "Общий контакт" : contact.first_and_last_name,
        options: array,
      });
    });
    return data;
  },
  normalizeContactsForMultiselectOnlyEmails(contacts) {
    let data = [];
    contacts.map((contact) => {
      let array = [];

      contact.emails.map((item) => {
        array.push({
          label: item.email,
          value: {
            contact_id: item.contact_id,
            id: item.id,
            type: 1,
            value: item.email,
          },
        });
      });
      if (!array.length) return;
      data.push({
        label: contact.type ? "Общий контакт" : contact.first_and_last_name,
        options: array,
      });
    });
    return data;
  },
  normalizeDataForRequestForm(data) {
    let array = [];

    data.directions.map((item) => {
      array.push(item.direction);
    });
    data.directions = array;

    array = [];
    data.districts.map((item) => {
      array.push(item.district);
    });
    data.districts = array;

    array = [];
    data.gateTypes.map((item) => {
      array.push(item.gate_type);
    });
    data.gateTypes = array;

    array = [];
    data.objectClasses.map((item) => {
      array.push(item.object_class);
    });
    data.objectClasses = array;

    array = [];
    data.objectTypes.map((item) => {
      array.push(item.object_type);
    });
    data.objectTypes = array;

    array = [];
    data.regions.map((item) => {
      array.push(item.region);
    });
    data.regions = array;

    array = [];
    return data;
  },
  normalizeDataForCompanyForm(data) {
    data.contacts = data.contacts.find((item) => item.type == 1);
    if (!data.contacts) {
      data.contacts = {
        emails: [],
        phones: [],
        websites: [],
      };
      return data;
    }
    return data;
  },
  normalizeDataForUserForm(data) {
    delete data.password;
    delete data.created_at;
    return data;
  },
};

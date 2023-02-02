<template>
  <div class="statisctic">
    <h1>NIGGA</h1>
    <button class="btn-primary btn" @click="run">Test</button>
  </div>
</template>

<script>
import { dataMapper } from "@/utils";
export default {
  name: "Statistic",
  methods: {
    run() {
      const object = {
        company_id: 12,
        text: "nigger 1234",
        flag: false,
        suka: {
          nigger: 123,
        },
        test: "sdadwad",
        ACDC: [
          {
            ppp: 444,
            ccc: 666,
            uuu: [{ lll: "dsadaw" }],
          },
          {
            ppp: 111,
            ccc: 888,
            uuu: [{ lll: "dsadaw" }],
          },
          {
            ppp: 111,
            ccc: 888,
          },
        ],
      };
      const rules = {
        company_id: "company",
        text: "content",
        flag: "truefalse",
        suka: "aaa",
        aaa: {
          nigger: "white",
        },
        test: "store",
        store: {
          fuck: "suck",
        },
        ACDC: {
          ppp: "iii",
          uuu: "eee",
          eee: {
            lll: "fuckthepolice",
          },
        },
      };
      const newObject = dataMapper(object, rules);
      console.log(object);
      console.log(newObject);
    },
  },
};
</script>

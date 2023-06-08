import { formatterObject, apiUrlHelperObject } from "./plugins";

declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    $formatter: typeof formatterObject;
    $apiUrlHelper: typeof apiUrlHelperObject;
  }
}

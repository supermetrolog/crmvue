import { createSharedComposable, useWindowFocus } from '@vueuse/core';

export const useSharedWindowFocus = createSharedComposable(useWindowFocus);

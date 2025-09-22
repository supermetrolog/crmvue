import { MaybeElementRef, unrefElement } from '@vueuse/core';
import { computed, MaybeRef, onMounted, onScopeDispose, Ref, ref, toValue, watch } from 'vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';
import { MaskaDetail, MaskInput, MaskInputOptions, MaskType } from 'maska';
import { isNullish } from '@/utils/helpers/common/isNullish';

export function useMask(
    element: MaybeElementRef,
    template: MaybeRef<MaskType | MaskInputOptions>,
    model?: Ref<string | null | undefined>
) {
    let instance: MaskInput | null = null;

    const unmasked = ref('');
    const masked = ref('');

    function onMaska(detail: MaskaDetail) {
        unmasked.value = detail.unmasked;
        masked.value = detail.masked;

        if (model) {
            model.value = unmasked.value;
        }
    }

    const options = computed<MaskInputOptions>(() => {
        const templateValue = toValue(template);

        if (isNullish(templateValue)) return { onMaska };

        if (typeof templateValue === 'string' || Array.isArray(templateValue)) {
            return {
                onMaska,
                mask: templateValue
            };
        }

        return {
            ...(templateValue as MaskInputOptions),
            onMaska
        };
    });

    function initialize() {
        const el = unrefElement(element);

        if (!el) return;

        if (isNotNullish(instance)) destroy();

        instance = new MaskInput(el as HTMLInputElement, options.value);
    }

    function destroy() {
        instance?.destroy();
    }

    onMounted(initialize);
    onScopeDispose(destroy);

    function refresh() {
        instance?.update(options.value);
    }

    function refreshValue() {
        const el = unrefElement(element);

        if (el) {
            instance?.updateValue(el as HTMLInputElement);
        }
    }

    watch(options, refresh, { deep: true });

    return {
        masked,
        unmasked,
        instance,
        refresh,
        refreshValue
    };
}

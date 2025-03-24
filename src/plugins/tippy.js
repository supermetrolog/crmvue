import { directive as tippyDirective, tippy } from 'vue-tippy';

export function initTippy(app) {
    tippy.setDefaultProps({ placement: 'auto-end', allowHTML: true });

    app.directive('tippy', tippyDirective);
}

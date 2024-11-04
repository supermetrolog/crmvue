import { notify } from '@kyvg/vue3-notification';

const notifyOptions = {
    group: 'app',
    type: 'success',
    duration: 5000
};

function setNotify(response) {
    const data = response.data;

    notifyOptions.title = response.statusText;

    if (Array.isArray(data.message)) {
        data.message.forEach(element => {
            notifyOptions.text = element;
            notify(notifyOptions);
        });
    } else {
        notifyOptions.text = data.message;
        notify(notifyOptions);
    }
}

/**
 *
 * @param response
 * @return {*|null}
 */
export function responseToData(response) {
    if (response == null) return null;

    if (response.data && typeof response.data !== 'string' && typeof response.data !== 'number') {
        if (
            !Array.isArray(response.data) &&
            'message' in response.data &&
            'data' in response.data
        ) {
            setNotify(response);
            return response.data.data;
        }
    }
    return response.data;
}

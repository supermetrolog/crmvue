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
 * @module SuccessHandler
 * Обработка успешных запросов на сервер
 *
 * @param {function} SuccessHandler.getData - Вернёт содержимое `Response.data` с отправкой возможных оповещений
 * @param {function} SuccessHandler.getPaginationData - Вернёт пагинацию ответа сервера
 * @type {{getPaginationData(Response): {pageCount, perPage, totalCount, currentPage}, getData(Response): (*)}}
 */
export const SuccessHandler = {
    getData(Response) {
        if (Response.data && typeof Response.data !== 'string') {
            if (!Array.isArray(Response.data) && 'message' in Response.data) {
                setNotify(Response);
                return Response.data.data;
            }
        }
        return Response.data;
    },
    getPaginationData(Response) {
        return {
            totalCount: +Response.headers['x-pagination-total-count'],
            perPage: +Response.headers['x-pagination-per-page'],
            pageCount: +Response.headers['x-pagination-page-count'],
            currentPage: +Response.headers['x-pagination-current-page']
        };
    }
};

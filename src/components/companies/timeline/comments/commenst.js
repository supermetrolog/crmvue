import { WayOfSending } from "../../../../const/Const";
import { apiUrlHelperObject, formatterObject } from "../../../../plugins";

export const DEFAULT_COMMENT_TYPE = 1;
export const NOTIFICATION_COMMENT_TYPE = 2;
export const ALREADY_SEND_OFFERS_COMMENT_TYPE = 3;
export const SEND_OFFERS_COMMENT_TYPE = 4;
export const DONE_COMMENT_TYPE = 5;

class Comment {
    constructor(step, type = DEFAULT_COMMENT_TYPE) {
        this.timeline_id = step.timeline_id;
        this.timeline_step_id = step.id;
        this.timeline_step_number = step.number;
        this.title = "система";
        this.comment = null;
        this.type = type;
    }

    _setSystemTitle() {
        this.title = 'система';
    }
    _setUserTitle(username) {
        this.title = 'система/' + username;
    }

    _setComment() {
        this.comment = "default comment";
    }
}

export default class CommentWithAutoSetComment extends Comment {
    constructor(step, type = DEFAULT_COMMENT_TYPE) {
        super(step, type);
        this._setComment();
    }
}

export class PhonedComment extends CommentWithAutoSetComment {
    _setComment() {
        this.comment = "Состоялся первичный диалог с клиентом";
    }
}

export class CallbackComment extends Comment {
    constructor(step, date) {
        super(step, NOTIFICATION_COMMENT_TYPE);
        this.callBackDate = date;
        this._setComment();
    }

    _setComment() {
        this.comment = "Устанвовлено напоминание о звонке: " + this.callBackDate;
    }
}

export class CallingErrorComment extends CommentWithAutoSetComment {
    _setComment() {
        this.comment = "Не удалось дозвониться, попытайтесь позднее";
    }
}

export class MeetingDoneComment extends CommentWithAutoSetComment {
    _setComment() {
        this.comment = "Запрос утвержден, переходим к отправке предложений";
    }
}

export class OffersNotFoundComment extends CommentWithAutoSetComment {
    _setComment() {
        this.comment = "Не удалось найти подходищие объекты, посмотрите у конкурентов или на ЦИАН";
    }
}

export class AlreadySendOffersComment extends Comment {
    constructor(step, sendOffersLength, contacts, wayOfSending, letterID) {
        super(step, ALREADY_SEND_OFFERS_COMMENT_TYPE);
        this._sendOffersLength = sendOffersLength;
        this._contacts = contacts;
        this._wayOfSending = wayOfSending;
        this._letterID = letterID;

        this._setComment();
    }

    _setComment() {
        const link = this._getLink();
        const contactsStr = this._getContacts();
        const wayOfSendingStr = this._getWayOfSending();
        const sendOffersLengthStr = this._getSendOffersLength();
        this.comment = `Отправлено ${sendOffersLengthStr} не через текущий безнес процесс ${contactsStr} по ${wayOfSendingStr}, ${link}`;
    }
    _getLink() {
        return `<a class="text-primary d-inline" href='/letters/${this._letterID}'>просмотреть</a>`;
    }
    _getSendOffersLength() {
        if (this._sendOffersLength == 1)
            return this._sendOffersLength + " предложение";
        else if (this._sendOffersLength < 5)
            return this._sendOffersLength + " предложения";
        return this._sendOffersLength + " предложений";
    }

    _getContacts() {
        const str = this._contacts.map((elem) => `<span class="d-inline"><b>${elem}</b></span>`).join(", ");
        if (this._contacts.length > 1) {
            return `контактам: ${str}`;
        }
        return `контакту: ${str}`;
    }

    _getWayOfSending() {
        const wayOfSendingOptions = WayOfSending.get("param");
        return this._wayOfSending.map(way => `<i class="d-inline ${wayOfSendingOptions[way][1].icon}" title="${wayOfSendingOptions[way][1].name}"></i>`).join(" ");
    }
}

export class SendOffersComment extends AlreadySendOffersComment {
    _setComment() {
        this.type = SEND_OFFERS_COMMENT_TYPE;
        const link = this._getLink();
        const contactsStr = this._getContacts();
        const wayOfSendingStr = this._getWayOfSending()
        const sendOffersLengthStr = this._getSendOffersLength();
        this.comment = `Отправлено ${sendOffersLengthStr} ${contactsStr} по ${wayOfSendingStr}, ${link}`;
    }

}


export class FeedbackOffersNotFoundComment extends CommentWithAutoSetComment {
    _setComment() {
        this.comment = "Предложения клиента не заинтересовали, попробуйте поискать еще варианты";
    }
}

export class FeedbackDoneComment extends CommentWithAutoSetComment {
    _setComment() {
        this.type = DONE_COMMENT_TYPE;
        this.comment = "Получена обратная связь от клиента по объектам";
    }
}

export class FeedbackWaysConfirmedComment extends CommentWithAutoSetComment {
    _setComment() {
        this.type = DONE_COMMENT_TYPE;
        this.comment = "Отметил способ получения обратной связи";
    }
}

export class InspectionOffersNotFound extends CommentWithAutoSetComment {
    _setComment() {
        this.comment = "Клиент передумал осматривать, заинтересовавшие его помещения, разберите ситуацию, попробуйте понять причину или подберите новые предложения";
    }
}

class DoneComment extends Comment {
    constructor(step, selectedObjects) {
        super(step, DONE_COMMENT_TYPE)
        this._selectedObjects = selectedObjects;
        this._setComment();
    }
    _setComment() {}

    _getObjectsStr() {
        return this._selectedObjects.map(elem => this._getObjectLink(elem)).join(", ");
    }
    _getObjectLink(offer) {
        let region = formatterObject.text().ucFirst(offer.region_name);
        let town = formatterObject.text().ucFirst(offer.town_name);
        let id = offer.visual_id;

        return `<a target="_blank" class="text-primary d-inline" href="${this._getOfferUrl(offer)}">${id} - ${region}, ${town}</a>`
    }
    _getOfferUrl(offer) {
        const baseUrl = apiUrlHelperObject.prodObjectsUrl + "complex/";
        let url = baseUrl + offer.complex_id;
        if (offer.type_id == 3) {
            return url;
        }
        if (offer.generalOffersMix) {
            url += "?offer_id=[" + offer.generalOffersMix.original_id + "]";
        } else {
            url += "?offer_id=[" + offer.original_id + "]";
        }
        return url;
    }
}

export class InspectionDoneComment extends DoneComment {
    _setComment() {
        this.comment = `Организован показ по объектам: ${this._getObjectsStr()}`;
    }
}

export class VisitDoneComment extends DoneComment {
    _setComment() {
        this.comment = `Осмотрели объекты: ${this._getObjectsStr()}`;
    }
}

export class VisitOffersNotFound extends CommentWithAutoSetComment {
    _setComment() {
        this.comment = "Клиент передумал осматривать, заинтересовавшие его помещения, разберите ситуацию, попробуйте понять причину или подберите новые предложения";
    }
}

export class InterestDoneComment extends DoneComment {
    _setComment() {
        this.comment = `Есть интерес к объектам: ${this._getObjectsStr()}`;
    }
}

export class InterestOffersNotFound extends CommentWithAutoSetComment {
    _setComment() {
        this.comment = "Клиенту не подошли помещения, которые осмотрели, не беда, разберите ситуацию, попробуйте понять причину и подберите новые предложения";
    }
}

export class TalkDoneComment extends DoneComment {
    _setComment() {
        this.comment = `Ведутся переговоры по объектам: ${this._getObjectsStr()}`;
    }
}

export class TalkOffersNotFound extends CommentWithAutoSetComment {
    _setComment() {
        this.comment = "Переговоры не состоялись, разберите ситуацию, попробуйте понять причину и подберите новые предложения";
    }
}

export class DealDoneComment extends CommentWithAutoSetComment {
    _setComment() {
        this.comment = "Ура! Супер, вы завершили успешно текущий бизнес процесс";
    }
}

export class DealOffersNotFound extends CommentWithAutoSetComment {
    _setComment() {
        this.comment = "Сделка провалилась, не отчаивайтесь, разберите ситуацию, начните все заново и у вас все получится";
    }
}
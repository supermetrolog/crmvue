import { WayOfSending } from "../../../../const/Const";

const DEFAULT_COMMENT_TYPE = 1;
const NOTIFICATION_COMMENT_TYPE = 2;
const ALREADY_SEND_OFFERS_COMMENT_TYPE = 3;
const SEND_OFFERS_COMMENT_TYPE = 4;

export default class Comment {
    constructor(step, type = DEFAULT_COMMENT_TYPE) {
        this.timeline_id = step.timeline_id;
        this.timeline_step_id = step.id;
        this.timeline_step_number = step.number;
        this.title = "система";
        this.comment = null;
        this.type = type;
    }

    setSystemTitle() {
        this.title = 'система';
    }
    setUserTitle(username) {
        this.title = 'система/' + username;
    }

    setComment(comment) {
        this.comment = comment;
    }
}

export class PhonedComment extends Comment {
    constructor(step, type = DEFAULT_COMMENT_TYPE) {
        super(step, type);
        this.setComment();
    }

    setComment() {
        this.comment = "Состоялся первичный диалог с клиентом";
    }
}

export class CallbackComment extends Comment {
    constructor(step, date, type = NOTIFICATION_COMMENT_TYPE) {
        super(step, type);
        this.callBackDate = date;
        this.setComment();
    }

    setComment() {
        this.comment = "Устанвовлено напоминание о звонке: " + this.callBackDate;
    }
}

export class CallingErrorComment extends Comment {
    constructor(step, type = DEFAULT_COMMENT_TYPE) {
        super(step, type);
        this.setComment();
    }

    setComment() {
        this.comment = "Не удалось дозвониться, попытайтесь позднее";
    }
}

export class MeetingDoneComment extends Comment {
    constructor(step, type = DEFAULT_COMMENT_TYPE) {
        super(step, type);
        this.setComment();
    }

    setComment() {
        this.comment = "Запрос утвержден, переходим к отправке предложений";
    }
}

export class ObjectsNotFoundComment extends Comment {
    constructor(step, type = DEFAULT_COMMENT_TYPE) {
        super(step, type);
        this.setComment();
    }

    setComment() {
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
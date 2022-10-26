const DEFAULT_COMMENT_TYPE = 1;
const NOTIFICATION_COMMENT_TYPE = 2;
const OBJECTS_COMMENT_TYPE = 3;

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

export class SendObjectsComment extends Comment {
    constructor(step, sendObjectsLenght, contacts, wayOfSending, alreadySend, letterID, type = OBJECTS_COMMENT_TYPE) {
        super(step, type);
        this.setComment(sendObjectsLenght, contacts, wayOfSending, alreadySend, letterID);
    }

    setComment(sendObjectsLenght, contacts, wayOfSending, alreadySend, letterID) {
        const link = this._getLink(letterID);
        const contactsStr = this._getContacts(contacts);
        const wayOfSendingStr = this._getWayOfSending(wayOfSending)
        this.comment = `Отправлено письмо с ${sendObjectsLenght} предложениями ${contactsStr} по ${wayOfSendingStr}, ${link}`;
    }

    _getLink(letterID) {
        return `<a href='/letters/${letterID}'>просмотреть</a>`;
    }

    _getContacts(contacts) {
        const str = contacts.map((elem) => `<span class="d-inline"><b>${elem}</b></span>`).join(", ");
        if (contacts.length > 1) {
            return `контактам: ${str}`;
        }
        return `контакту: ${str}`;
    }

    _getWayOfSending(wayOfSending) {
        return wayOfSending.join(", ");
    }
}
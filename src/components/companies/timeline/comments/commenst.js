export default class Comment {
    constructor(step, type = 1) {
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
    constructor(step, type = 1) {
        super(step, type);
        this.setComment();
    }

    setComment() {
        this.comment = "Состоялся первичный диалог с клиентом";
    }
}

export class CallbackComment extends Comment {
    constructor(step, date, type = 2) {
        super(step, type);
        this.callBackDate = date;
        this.setComment();
    }

    setComment() {
        this.comment = "Устанвовлено напоминание о звонке: " + this.callBackDate;
    }
}

export class CallingErrorComment extends Comment {
    constructor(step, type = 1) {
        super(step, type);
        this.setComment();
    }

    setComment() {
        this.comment = "Не удалось дозвониться, попытайтесь позднее";
    }
}

export class MeetingDoneComment extends Comment {
    constructor(step, type = 1) {
        super(step, type);
        this.setComment();
    }

    setComment() {
        this.comment = "Запрос утвержден, переходим к отправке предложений";
    }
}
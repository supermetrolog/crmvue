/**
 * @typedef {'user'|'request'|'object'} ChatMemberModelType
 */

/**
 * @typedef User
 * @property {number} id
 * @property {number} role
 * @property {string} updated_at
 * @property {string} created_at
 * @property {UserProfile} userProfile
 */

/**
 * @typedef UserProfile
 * @property {number} id
 * @property {number} user_id
 * @property {string} first_name
 * @property {string} middle_name
 * @property {string} last_name
 * @property {string} medium_name
 * @property {string|null} avatar
 * @property {number|null} caller_id
 */

/**
 * @typedef LastCall
 * @property {number} id
 * @property {number} user_id
 * @property {User} user
 * @property {number} contact_id
 * @property {string} created_at
 * @property {string} updated_at
 * @property {string|null} deleted_at
 */

/**
 * @typedef ChatMemberStatistic
 * Объект статистики по непрочитанным сообщениям, задачам и прочему
 * @property {number} tasks - количество задач
 * @property {number} reminders - количество напоминаний
 * @property {number} notifications - количество уведомлений
 * @property {number} messages - количество сообщений
 */

/**
 * @typedef ChatMember
 * @property {number} id
 * @property {string} created_at
 * @property {string} updated_at
 * @property {string} model_id
 * @property {ChatMemberModelType} model_type
 * @property {ChatMemberModel} model
 * @property {LastCall} last_call
 * @property {ChatMemberStatistic} statistic
 */

/**
 * @typedef {User|object} ChatMemberModel
 */

/**
 * @typedef Message
 * @property {array} alerts
 * @property {array} contacts
 * @property {string} created_at
 * @property {array} files
 * @property {ChatMember} from
 * @property {number} from_chat_member_id
 * @property {number} id
 * @property {boolean} is_viewed
 * @property {string} message
 * @property {array} notifications
 * @property {array} reminders
 * @property {array} tags
 * @property {array} tasks
 * @property {number} to_chat_member_id
 * @property {string} updated_at
 */

/**
 * @typedef MessageLabel
 * @property {boolean} isLabel - По умолчанию `true`. Сообщает, что это `label`. Для удобства при проходах по списку сообщений
 * @property {string} id - Уникальный ID.
 * @property {dayjs.Dayjs} label - Дата первого в этой секции сообщения в формате `dayjs`
 *
 */

export const logHandler = {
    logItemFormat(user, message, type, created_at, updated_at, id) {
        return {
            user,
            message,
            type,
            created_at,
            updated_at,
            id
        };
    },
    logListFormat(array) {
        return array.map(item =>
            this.logItemFormat(
                item.user.userProfile.short_name,
                item.message,
                item.type,
                item.created_at,
                item.updated_at,
                item.id
            )
        );
    }
};

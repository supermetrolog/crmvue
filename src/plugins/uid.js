function $idFactory(uidProperty) {
    return function $id(id = '') {
        return `${this[uidProperty]}-${id}`;
    };
}

const DEFAULTS = {
    uidProperty: 'uid',
    uidPrefix: 'uid-'
};

const UniqueID = {
    install: function (app, options = {}) {
        const uidProperty = options.uidProperty || DEFAULTS.uidProperty;
        const uidPrefix = options.uidPrefix || DEFAULTS.uidPrefix;
        let uidCounter = 0;

        app.mixin({
            beforeCreate() {
                uidCounter++;
                const uid = uidPrefix + uidCounter;
                Object.defineProperties(this, {
                    [uidProperty]: {
                        get() {
                            return uid;
                        }
                    }
                });
            }
        });

        app.config.globalProperties.$id = $idFactory(uidProperty);
    }
};

export default UniqueID;

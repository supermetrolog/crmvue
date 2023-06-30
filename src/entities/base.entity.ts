import {dateFormatter} from "@/utils/dateFormatter";

abstract class BaseEntity {
    protected dateFormatter = dateFormatter;
    protected processBooleanField = (value: any): boolean | null => value !== null ? !!value : null;

    public load(config: Record<string, any> = {}): void {
        for (const configKey in config) {
            const key = '_' + configKey;
            if (key in this) {
                this[key as keyof this] = config[configKey];
            } else if (configKey in this && Object.getOwnPropertyDescriptor(this, configKey)) {
                this[configKey as keyof  this] = config[configKey]
            }
        }
    }
}

export default BaseEntity
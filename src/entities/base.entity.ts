import {dateFormatter} from "@/plugins";

abstract class BaseEntity {
    protected dateFormatter = dateFormatter;
    protected setBooleanField = (value: any): boolean | null => value !== null ? !!value : null;
}

export default BaseEntity
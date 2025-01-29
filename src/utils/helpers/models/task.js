import { taskOptions } from '@/const/options/task.options.js';

export function isCompletedTask(task) {
    return task.status === taskOptions.clearStatusTypes.COMPLETED;
}

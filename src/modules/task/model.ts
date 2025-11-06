import { Task, TaskTypeEnum } from '@/types/task';

export function isCallTask(task: Task) {
    return task.type === TaskTypeEnum.SCHEDULED_CALL;
}

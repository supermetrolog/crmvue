import { Identifiable } from '@/types/base';
import { File } from '@/types/file';
import { Task } from '@/types/task';

export interface SurveyQuestionAnswer extends Identifiable {
    survey_id: number;
    question_answer_id: number;
    value: string | null;
    files?: File[];
    tasks?: Task[];
}

import { Identifiable, SoftDelete, Timestamps } from '@/types/base';
import { QuestionAnswer } from '@/types/survey/question-answer';

export interface Question extends Identifiable, Timestamps, SoftDelete {
    group: string | null;
    template: string | null;
    text: string;
    answers?: Record<string, QuestionAnswer[]>;
}

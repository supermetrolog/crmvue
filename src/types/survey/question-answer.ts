import { Identifiable, SoftDelete, Timestamps } from '@/types/base';
import { Effect } from '@/types/survey/effect';
import { SurveyQuestionAnswer } from '@/types/survey/survey-question-answer';

export interface QuestionAnswer extends Identifiable, Timestamps, SoftDelete {
    question_id: number;
    field_id: number;
    category: string;
    value: string;
    message: string | null;
    effects?: Effect[];
    surveyQuestionAnswer?: SurveyQuestionAnswer | null;
}

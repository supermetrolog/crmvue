import { User, UserProfileGenderEnum } from '@/types/user';

export function genderize(
    user: User,
    maleForm: string,
    femaleForm: string,
    neutralForm?: string
): string {
    switch (user.userProfile?.gender) {
        case UserProfileGenderEnum.MALE:
            return maleForm;
        case UserProfileGenderEnum.FEMALE:
            return femaleForm;
        default:
            return neutralForm ?? maleForm;
    }
}

export function genderizeTemplate(
    template: string,
    user: User,
    maleForm: string,
    femaleForm: string,
    neutralForm?: string
): string {
    const gendered = genderize(user, maleForm, femaleForm, neutralForm);
    return template.replace(/%s/g, gendered);
}

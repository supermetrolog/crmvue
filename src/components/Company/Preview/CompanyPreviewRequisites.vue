<template>
    <div class="company-preview-tab__grid">
        <ul class="company-preview-tab__list">
            <CompanyBoxRow label="Юр. адрес">
                <span v-if="company.legalAddress">
                    {{ company.legalAddress }}
                </span>
            </CompanyBoxRow>
            <CompanyBoxRow label="ОГРН">
                <span v-if="company.ogrn">
                    {{ company.ogrn }}
                </span>
            </CompanyBoxRow>
            <CompanyBoxRow label="ИНН">
                <span v-if="company.inn">
                    {{ company.inn }}
                </span>
            </CompanyBoxRow>
            <CompanyBoxRow label="КПП">
                <span v-if="company.kpp">
                    {{ company.kpp }}
                </span>
            </CompanyBoxRow>
            <CompanyBoxRow label="Расчетный счет">
                <span v-if="company.checkingAccount">
                    {{ company.checkingAccount }}
                </span>
            </CompanyBoxRow>
            <CompanyBoxRow label="Кор. счет">
                <span v-if="company.correspondentAccount">
                    {{ company.correspondentAccount }}
                </span>
            </CompanyBoxRow>
            <CompanyBoxRow label="В банке">
                <span v-if="company.inTheBank">
                    {{ company.inTheBank }}
                </span>
            </CompanyBoxRow>
        </ul>
        <ul class="company-preview-tabs__list">
            <CompanyBoxRow label="БИК">
                <span v-if="company.bik">
                    {{ company.bik }}
                </span>
            </CompanyBoxRow>
            <CompanyBoxRow label="ОКПО">
                <span v-if="company.okpo">
                    {{ company.okpo }}
                </span>
            </CompanyBoxRow>
            <CompanyBoxRow label="ОКВЭД">
                <span v-if="company.okved">
                    {{ company.okved }}
                </span>
            </CompanyBoxRow>
            <CompanyBoxRow label="Имя подписанта">
                <span v-if="company.signatoryName">
                    {{ company.signatoryName }}
                </span>
            </CompanyBoxRow>
            <CompanyBoxRow label="Фамилия подписанта">
                <span v-if="company.signatoryMiddleName">
                    {{ company.signatoryMiddleName }}
                </span>
            </CompanyBoxRow>
            <CompanyBoxRow label="Отчество подписанта">
                <span v-if="company.signatoryLastName">
                    {{ company.signatoryLastName }}
                </span>
            </CompanyBoxRow>
            <CompanyBoxRow label="№ документа">
                <span v-if="company.documentNumber">
                    {{ company.documentNumber }}
                </span>
            </CompanyBoxRow>
            <CompanyBoxRow label="Действует на основе">
                <span v-if="company.basis">
                    {{ company.basis }}
                </span>
            </CompanyBoxRow>
        </ul>
    </div>
</template>

<script setup>
import CompanyBoxRow from '@/components/Company/Box/CompanyBoxRow.vue';

defineProps({
    company: {
        type: Object,
        required: true
    }
});
</script>

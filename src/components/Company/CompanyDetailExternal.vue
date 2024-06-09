<template>
    <div class="row">
        <CompanyDetailRow label="Юр. адрес">
            {{ company.legalAddress || '&#8212;' }}
        </CompanyDetailRow>
        <CompanyDetailRow label="ОГРН">
            {{ company.ogrn || '&#8212;' }}
        </CompanyDetailRow>
        <CompanyDetailRow label="ИНН">
            {{ company.inn || '&#8212;' }}
        </CompanyDetailRow>
        <CompanyDetailRow label="КПП">
            {{ company.kpp || '&#8212;' }}
        </CompanyDetailRow>
        <CompanyDetailRow label="БИК">
            {{ company.bik || '&#8212;' }}
        </CompanyDetailRow>
        <CompanyDetailRow label="ОКПО">
            {{ company.okpo || '&#8212;' }}
        </CompanyDetailRow>
        <CompanyDetailRow label="ОКВЭД">
            {{ company.okved || '&#8212;' }}
        </CompanyDetailRow>
        <CompanyDetailRow label="Рсч/сч">
            {{ company.checkingAccount || '&#8212;' }}
        </CompanyDetailRow>
        <CompanyDetailRow label="Крсп/сч">
            {{ company.correspondentAccount || '&#8212;' }}
        </CompanyDetailRow>
        <CompanyDetailRow label="В банке">
            {{ company.inTheBank || '&#8212;' }}
        </CompanyDetailRow>
        <CompanyDetailRow label="Имя подписанта">
            {{ company.signatoryName || '&#8212;' }}
        </CompanyDetailRow>
        <CompanyDetailRow label="Фамилия подписанта">
            {{ company.signatoryMiddleName || '&#8212;' }}
        </CompanyDetailRow>
        <CompanyDetailRow label="Отчество подписанта">
            {{ company.signatoryLastName || '&#8212;' }}
        </CompanyDetailRow>
        <CompanyDetailRow label="№ документа">
            {{ company.documentNumber || '&#8212;' }}
        </CompanyDetailRow>
        <CompanyDetailRow label="Действует на основе">
            {{ company.basis || '&#8212;' }}
        </CompanyDetailRow>
    </div>
</template>

<script>
import CompanyDetailRow from '@/components/Company/CompanyDetailRow.vue';

export default {
    name: 'CompanyDetailExternal',
    components: {
        CompanyDetailRow
    },
    props: {
        company: {
            type: Object,
            required: true
        }
    }
};
</script>

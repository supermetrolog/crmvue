<template>
    <div class="messenger-aside-header">
        <Form class="messenger-aside-header__form">
            <Input rounded placeholder="Поиск.." />
        </Form>
    </div>
</template>
<script>
import Form from '@/components/common/Forms/Form.vue';
import Input from '@/components/common/Forms/Input.vue';

export default {
    name: 'MessengerAsideHeader',
    components: { Input, Form }
};
</script>

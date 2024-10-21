<template>
    <div class="messenger-dialog-object-preview">
        <MessengerDialogPreviewTab title="Проверьте выбранный тип и назнечение!">
            <MessengerDialogPreviewPurposesSkeleton />
        </MessengerDialogPreviewTab>
        <MessengerDialogPreviewTab title="Проверьте информацию об объекте!">
            <div class="messenger-dialog-preview__grid">
                <MessengerDialogPreviewRow label="фото">
                    <p class="skeleton">загрузка данных..</p>
                </MessengerDialogPreviewRow>
                <MessengerDialogPreviewRow label="эл-во общее">
                    <p class="skeleton">загрузка данных..</p>
                </MessengerDialogPreviewRow>
                <MessengerDialogPreviewRow label="эл-во выделенное">
                    <p class="skeleton">загрузка данных..</p>
                </MessengerDialogPreviewRow>
                <MessengerDialogPreviewRow>
                    <template #label>
                        <span>м<sup>3</sup> водоснабжение</span>
                    </template>
                    <template #default>
                        <p class="skeleton">загрузка данных..</p>
                    </template>
                </MessengerDialogPreviewRow>
                <MessengerDialogPreviewRow>
                    <template #label>
                        <span>м<sup>3</sup> канализация</span>
                    </template>
                    <template #default>
                        <p class="skeleton">загрузка данных..</p>
                    </template>
                </MessengerDialogPreviewRow>
                <MessengerDialogPreviewRow label="Ж/Д">
                    <p class="skeleton">загрузка данных..</p>
                </MessengerDialogPreviewRow>
                <MessengerDialogPreviewRow label="въезд на территорию">
                    <p class="skeleton">загрузка данных..</p>
                </MessengerDialogPreviewRow>
                <MessengerDialogPreviewRow label="планировки">
                    <p class="skeleton">загрузка данных..</p>
                </MessengerDialogPreviewRow>
                <MessengerDialogPreviewRow label="кадастровый номер">
                    <p class="skeleton">загрузка данных..</p>
                </MessengerDialogPreviewRow>
                <MessengerDialogPreviewRow label="земельный участок">
                    <p class="skeleton">загрузка данных..</p>
                </MessengerDialogPreviewRow>
            </div>
        </MessengerDialogPreviewTab>
        <MessengerDialogPreviewTab title="Проверьте цену и параметры сделки!">
            <Tabs
                nav-class="messenger-dialog-preview__tabs"
                nav-item-class="messenger-dialog-preview__tab"
                nav-item-link-class="messenger-dialog-preview__tab-link skeleton skeleton--rect"
                with-transition
            >
                <Tab name="Аренда">
                    <div class="messenger-dialog-preview__grid">
                        <MessengerDialogPreviewRow label="цена пола">
                            <template #label>
                                <span class="skeleton">загрузка данных..</span>
                            </template>
                            <p class="skeleton">загрузка данных..</p>
                        </MessengerDialogPreviewRow>
                        <MessengerDialogPreviewRow label="цена пола">
                            <template #label>
                                <span class="skeleton">загрузка данных..</span>
                            </template>
                            <p class="skeleton">загрузка данных..</p>
                        </MessengerDialogPreviewRow>
                        <MessengerDialogPreviewRow label="цена пола">
                            <template #label>
                                <span class="skeleton">загрузка данных..</span>
                            </template>
                            <p class="skeleton">загрузка данных..</p>
                        </MessengerDialogPreviewRow>
                        <MessengerDialogPreviewRow label="цена пола">
                            <template #label>
                                <span class="skeleton">загрузка данных..</span>
                            </template>
                            <p class="skeleton">загрузка данных..</p>
                        </MessengerDialogPreviewRow>
                        <MessengerDialogPreviewRow label="цена пола">
                            <template #label>
                                <span class="skeleton">загрузка данных..</span>
                            </template>
                            <p class="skeleton">загрузка данных..</p>
                        </MessengerDialogPreviewRow>
                        <MessengerDialogPreviewRow label="цена пола">
                            <template #label>
                                <span class="skeleton">загрузка данных..</span>
                            </template>
                            <p class="skeleton">загрузка данных..</p>
                        </MessengerDialogPreviewRow>
                        <MessengerDialogPreviewRow label="цена пола">
                            <template #label>
                                <span class="skeleton">загрузка данных..</span>
                            </template>
                            <p class="skeleton">загрузка данных..</p>
                        </MessengerDialogPreviewRow>
                        <MessengerDialogPreviewRow label="цена пола">
                            <template #label>
                                <span class="skeleton">загрузка данных..</span>
                            </template>
                            <p class="skeleton">загрузка данных..</p>
                        </MessengerDialogPreviewRow>
                        <MessengerDialogPreviewRow label="цена пола">
                            <template #label>
                                <span class="skeleton">загрузка данных..</span>
                            </template>
                            <p class="skeleton">загрузка данных..</p>
                        </MessengerDialogPreviewRow>
                    </div>
                </Tab>
                <Tab name="Продажа"></Tab>
                <Tab name="Отв.хранение"></Tab>
                <Tab name="Субаренда"></Tab>
            </Tabs>
        </MessengerDialogPreviewTab>
    </div>
</template>
<script setup>
import MessengerDialogPreviewTab from '@/components/Messenger/Dialog/Preview/MessengerDialogPreviewTab.vue';
import MessengerDialogPreviewRow from '@/components/Messenger/Dialog/Preview/MessengerDialogPreviewRow.vue';
import MessengerDialogPreviewPurposesSkeleton from '@/components/Messenger/Dialog/Preview/MessengerDialogPreviewPurposesSkeleton.vue';
import Tab from '@/components/common/Tabs/Tab.vue';
import Tabs from '@/components/common/Tabs/Tabs.vue';
</script>

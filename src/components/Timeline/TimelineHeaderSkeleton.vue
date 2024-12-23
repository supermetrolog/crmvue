<template>
    <div class="timeline-page-header skeleton-body">
        <div class="timeline-page-header__row">
            <div class="timeline-page-header__info timeline-page-header-info">
                <h2 class="timeline-page-header-info__title skeleton mb-1">
                    ООО Какое-то название компании на русском или английском - ФТБ
                </h2>
                <div class="timeline-page-header-info__properties">
                    <span class="timeline-page-header-info__group skeleton"> Группа компаний </span>
                    <span class="task-card-comment__dot mx-2">·</span>
                    <span>
                        <i class="fa-solid fa-door-open mr-1" />
                        <span class="skeleton">Иванов Иван</span>
                    </span>
                    <span class="task-card-comment__dot mx-2">·</span>
                    <span>
                        <i class="fa-solid fa-clock mr-1" />
                        <span class="skeleton">11.11.11, 11:11</span>
                    </span>
                    <span class="task-card-comment__dot mx-2">·</span>
                    <span>
                        <i class="fa-solid fa-rotate mr-1" />
                        <span class="skeleton">11.11.11, 11:11</span>
                    </span>
                </div>
            </div>
            <div class="timeline-page-header-actions">
                <HoverActionsButton class="skeleton">
                    <i class="fa-solid fa-pen"></i>
                </HoverActionsButton>
                <HoverActionsButton class="skeleton">
                    <i class="fa-solid fa-bell" />
                </HoverActionsButton>
                <HoverActionsButton class="skeleton">
                    <i class="fa-solid fa-pen"></i>
                </HoverActionsButton>
                <HoverActionsButton class="skeleton">
                    <i class="fa-solid fa-bell" />
                </HoverActionsButton>
                <div class="skeleton timeline-page-header__consultant">Иванов Иван</div>
                <div class="skeleton timeline-page-header__consultant">Пассив</div>
            </div>
        </div>
        <div class="timeline-page-header__tabs">
            <Button class="skeleton skeleton--rect">Прохождение Таймлайна</Button>
            <Button class="skeleton skeleton--rect">Логи Таймлайна</Button>
        </div>
    </div>
</template>

<script setup>
import Button from '@/components/common/Button.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
</script>

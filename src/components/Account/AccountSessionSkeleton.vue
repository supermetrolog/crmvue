<template>
    <div class="account-session skeleton-body">
        <div class="account-session__body">
            <div class="skeleton">
                <i class="account-session__icon fa-solid fa-desktop" />
            </div>
            <div>
                <div class="account-session__header">
                    <p class="account-session__name skeleton">Chrome, Windows 10, 100.10.0.11</p>
                </div>
                <div class="account-session__footer">
                    <DashboardChip class="skeleton account-session__chip" with-icon>
                        <i class="fa-regular fa-clock"></i>
                        1 января 1111
                    </DashboardChip>
                    <DashboardChip class="skeleton account-session__chip">
                        1.1.11, 11:11
                    </DashboardChip>
                </div>
            </div>
            <div class="account-session__actions">
                <HoverActionsButton small class="skeleton">
                    <i class="fa-solid fa-ban"></i>
                </HoverActionsButton>
            </div>
        </div>
    </div>
</template>
<script setup>
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
</script>

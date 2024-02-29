<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
    modelValue: String,
    tabs: Array<{ label: String, value: String }>
});

const emit = defineEmits(["update:modelValue"]);

const value = ref(props.modelValue);

const setValue = (v: any) => {
    emit("update:modelValue", v);
    value.value = v;
};
</script>

<template>
    <ul class="nav nav-tabs">
        <li class="nav-item" v-for="tab of props.tabs">
            <a class="nav-link cursor-pointer" :class="tab.value == value ? 'active' : ''" @click="setValue(tab.value)">
                {{ tab.label }}
            </a>
        </li>
    </ul>
</template>
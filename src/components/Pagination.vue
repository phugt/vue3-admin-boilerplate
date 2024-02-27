<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
    modelValue: {
        type: Number,
        default: 1,
    },
    pageCount: {
        type: Number,
        default: 0,
    },
    itemCount: {
        type: Number,
        default: 0,
    },
});

const emit = defineEmits(["update:modelValue"]);

const value = ref(props.modelValue);

const setValue = (v: any) => {
    emit("update:modelValue", v);
    value.value = v;
};
</script>

<template>
    <ul class="pagination pagination-sm m-0">
        <li v-if="value > 2" class="page-item"><a class="page-link cursor-pointer" @click="setValue(1)">««</a></li>
        <li v-if="value > 1" class="page-item"><a class="page-link cursor-pointer" @click="setValue(value - 1)">«</a></li>
        <li v-if="value > 2" class="page-item">
            <a class="page-link cursor-pointer" @click="setValue(value - 2)">{{ value - 2 }}</a>
        </li>
        <li v-if="value > 1" class="page-item">
            <a class="page-link cursor-pointer" @click="setValue(value - 1)">{{ value - 1 }}</a>
        </li>
        <li class="page-item active"><a class="page-link cursor-pointer">{{ value }}</a></li>
        <li v-if="pageCount - value > 0" class="page-item">
            <a class="page-link cursor-pointer" @click="setValue(value + 1)">{{ value + 1 }}</a>
        </li>
        <li v-if="pageCount - value > 1" class="page-item">
            <a class="page-link cursor-pointer" @click="setValue(value + 2)">{{ value + 2 }}</a>
        </li>
        <li v-if="pageCount - value > 0" class="page-item" @click="setValue(value + 1)"><a
                class="page-link cursor-pointer">»</a></li>
        <li v-if="pageCount - value > 1" class="page-item" @click="setValue(props.pageCount)"><a
                class="page-link cursor-pointer">»»</a></li>
    </ul>
</template>
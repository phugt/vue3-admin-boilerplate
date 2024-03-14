<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
    modelValue: String,
    error: String,
    readonly: Boolean,
})

const emit = defineEmits(["update:modelValue"]);

const value = ref(props.modelValue);

const setValue = (v: any) => {
    emit("update:modelValue", v);
    value.value = v;
}

</script>

<template>
    <div class="form-group">
        <label>{{ $t('selectUser') }}</label>
        <input v-model.trim="value" :readonly="readonly" class="form-control"
            :placeholder="$t('userId')" :class="error ? 'is-invalid' : ''">
        <div class="invalid-feedback">{{ error }}</div>
    </div>
</template>
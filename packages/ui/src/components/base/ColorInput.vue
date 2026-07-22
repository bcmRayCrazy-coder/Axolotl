<template>
	<div :class="[wrapperClass, { 'opacity-50 cursor-not-allowed': disabled }]" class="relative">
		<input :id="id" :value="model" :disabled="disabled" type="color" class="w-5 h-5" />
	</div>
</template>
<script setup lang="ts">
const model = defineModel<string>()

const props = defineProps<{
	id?: string
	disabled: boolean
	wrapperClass?: string
}>()
</script>

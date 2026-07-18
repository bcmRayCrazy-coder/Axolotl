<script setup lang="ts">
import { defineMessages, useVIntl } from '@modrinth/ui'
import { ref, watch } from 'vue'

import { getUpdateSource, setUpdateSource, type UpdateSource } from '@/helpers/settings.ts'

const { formatMessage } = useVIntl()
const selectedSource = ref<UpdateSource>(getUpdateSource())

const messages = defineMessages({
	title: {
		id: 'app.settings.updates.title',
		defaultMessage: 'Update source',
	},
	description: {
		id: 'app.settings.updates.description',
		defaultMessage:
			'Choose where Axolotl checks for launcher updates. Automatic selection tries the fastest available source and falls back when necessary.',
	},
	auto: {
		id: 'app.settings.updates.auto',
		defaultMessage: 'Automatic (recommended)',
	},
	autoDescription: {
		id: 'app.settings.updates.auto-description',
		defaultMessage: 'Use the CNB mirror first, then Gitee, then the official GitHub source.',
	},
	official: {
		id: 'app.settings.updates.official',
		defaultMessage: 'Official GitHub source',
	},
	officialDescription: {
		id: 'app.settings.updates.official-description',
		defaultMessage: 'Download directly from Axolotl GitHub Releases.',
	},
	cnb: {
		id: 'app.settings.updates.cnb',
		defaultMessage: 'CNB mirror',
	},
	cnbDescription: {
		id: 'app.settings.updates.cnb-description',
		defaultMessage: 'Use the China mainland mirror hosted on CNB, with GitHub fallback.',
	},
	gitee: {
		id: 'app.settings.updates.gitee',
		defaultMessage: 'Gitee mirror',
	},
	giteeDescription: {
		id: 'app.settings.updates.gitee-description',
		defaultMessage: 'Use the Gitee mirror, with the official source as fallback.',
	},
	security: {
		id: 'app.settings.updates.security',
		defaultMessage:
			'Every source uses the same signed update manifest. A mirror cannot install an update unless its signature is valid.',
	},
})

const options: Array<{
	value: UpdateSource
	label: keyof typeof messages
	description: keyof typeof messages
}> = [
	{ value: 'auto', label: 'auto', description: 'autoDescription' },
	{ value: 'official', label: 'official', description: 'officialDescription' },
	{ value: 'cnb', label: 'cnb', description: 'cnbDescription' },
	{ value: 'gitee', label: 'gitee', description: 'giteeDescription' },
]

watch(selectedSource, (source) => {
	setUpdateSource(source)
})
</script>

<template>
	<div class="flex flex-col gap-6">
		<div class="flex flex-col gap-2.5">
			<h2 class="m-0 text-lg font-semibold text-contrast">
				{{ formatMessage(messages.title) }}
			</h2>
			<p class="m-0 leading-tight text-secondary">
				{{ formatMessage(messages.description) }}
			</p>
		</div>

		<div class="flex flex-col gap-3" role="radiogroup" :aria-label="formatMessage(messages.title)">
			<label
				v-for="option in options"
				:key="option.value"
				class="flex cursor-pointer gap-3 rounded-xl bg-surface-4 p-4 transition-colors hover:bg-surface-5"
			>
				<input
					v-model="selectedSource"
					class="mt-1 accent-brand"
					name="update-source"
					type="radio"
					:value="option.value"
				/>
				<span class="flex flex-col gap-1">
					<span class="font-semibold text-contrast">{{
						formatMessage(messages[option.label])
					}}</span>
					<span class="text-sm leading-tight text-secondary">
						{{ formatMessage(messages[option.description]) }}
					</span>
				</span>
			</label>
		</div>

		<p class="m-0 rounded-xl bg-surface-4 p-4 text-sm leading-tight text-secondary">
			{{ formatMessage(messages.security) }}
		</p>
	</div>
</template>

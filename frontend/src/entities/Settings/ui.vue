<template>
	<div class="md:flex justify-center items-start w-full">
		<AddingNewChannels />
		<AddingPublicationTimeSettings />
        <AddingNewRoles />
	</div>
</template>

<script lang="ts" setup>
	import { AddingNewChannels, AddingNewRoles, AddingPublicationTimeSettings } from '@/widgets';
</script>

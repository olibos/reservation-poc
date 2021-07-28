<script lang="ts">
	import { buildings, selectedBuilding } from '../stores';
</script>

<section>
	<label for="buildings">Buildings:</label>
	<div>
		{#await $buildings}
			Loading the building list...
		{:then buildings}
			<select id="buildings" bind:value={$selectedBuilding}>
				<option />
				{#each buildings as building (building.id)}
					<option value={building.id}>{building.name}</option>
				{/each}
			</select>
		{/await}
	</div>
</section>

<style>
	@media (min-width: 768px) {
		section {
			display: grid;
			grid-template-columns: minmax(200px, 15vw) 1fr;
		}
	}
</style>

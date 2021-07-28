<script lang="ts">
	import { floors, selectedBuilding, selectedFloor } from '../stores';
</script>

{#if $selectedBuilding}
	<section>
		<label for="buildings">Floors:</label>
		<div>
			{#await $floors}
				Loading the floor list...
			{:then floors}
				<select id="buildings" bind:value={$selectedFloor}>
					<option />
					{#each floors as floor (floor.id)}
						<option value={floor}>{floor.name}</option>
					{/each}
				</select>
			{/await}
		</div>
	</section>
{/if}

<style>
	@media (min-width: 768px) {
		section {
			display: grid;
			grid-template-columns: minmax(200px, 15vw) 1fr;
		}
	}
</style>

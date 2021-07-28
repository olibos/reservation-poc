<script lang="ts">
	import Floors from '../components/Floors.svelte';
	import Buildings from '../components/Buildings.svelte';
	import {selectedFloor} from '../stores/selectedFloor';
	import { panAndZoom } from '../helpers';
</script>
<svelte:head>
	<title>Wavenet - Reservation</title>
</svelte:head>
<main>
	<section>
		<Buildings />
		<Floors />
	</section>
	<section class="map">
		{#if $selectedFloor?.map}
		<svg use:panAndZoom={$selectedFloor} style="visibility: hidden;" xmlns="http://www.w3.org/2000/svg">
			{@html $selectedFloor.map}
		</svg>	
		{/if}
</main>

<style>
	main
	{
		display: grid;
  		grid-template-rows: auto 1fr;
		width:100vw;
		height:100vh;
	}

	.map
	{
		overflow:hidden;
	}
	
	:global(.available) {
		fill: green;
		cursor:pointer;
	}

	:global(.unavailable) {
		fill: red;
		cursor:pointer;
	}
</style>

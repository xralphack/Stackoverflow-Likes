<template>
  	<div id="app">
		<item-list></item-list>
	</div>
</template>
<script>
	import ItemList from './components/ItemList.vue'
	export default {
		components: {
			'item-list': ItemList
		}
	}
</script>
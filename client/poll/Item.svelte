<script>
  export let item;
  export let total;

  console.log(item);

  $: percent = Math.round((item.points / total) * 100);

  // $: console.log({ percent, total });
</script>

<div class="flex text-gray-400 rounded overflow-hidden">
  <div class="p-2 bg-gray-800 truncate" style="width:100px;">{item.name}</div>
  <div class="p-2 bg-gray-800 text-right" style="width:50px;">{percent}%</div>
  <div class="p-2 bg-gray-600 rounded-r" style="width:{percent}%"></div>
</div>

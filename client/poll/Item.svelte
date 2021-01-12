<script>
  export let item;
</script>

<div
  id="item-{item.name}"
  class="relative flex text-gray-400 rounded overflow-hidden"
>
  <div class="p-2 bg-gray-800 truncate" style="width:100px;">{item.name}</div>
  <div class="p-2 bg-gray-800 text-right" style="width:50px;">
    {item.percent}%
  </div>
  <div class="p-2 bg-gray-600 rounded-r" style="width:{item.percent}%"></div>
  <canvas
    class="absolute"
    id="canvas-{item.name}"
    style="left:150px;width:{item.percent}%;height:100%"
  ></canvas>
</div>

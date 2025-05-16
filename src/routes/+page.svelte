<div class="city inset-0 absolute grayscale blur-lg"></div>
<svelte:head>
  <title>joon</title>
</svelte:head>
<h1 class="name w-80 brightness-150 m-auto rounded rounded-bl-[10rem]">
  Joon Suh
</h1>

<style lang="postcss">
  .city {
    background: url(../lib/city.avif) center / cover;
  }
  .blob {
    background: url(./orb.webp) center / 100% 100%;
  }
  .name {
    background: url(./orb.svg) center / cover;
    color: transparent;
    mask: url(./joon.svg) center / 45%;
    aspect-ratio: 57.530998/ 76.858734;
  }

  .bg {
    background: url(./orb.webp) center / cover;
  }
</style>

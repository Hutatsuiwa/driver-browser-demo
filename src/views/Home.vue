<template>
  <div class="home">
    <Face/>
  </div>
</template>

<script>
// @ is an alias to /src
import Face from '@/components/Face.vue'

export default {
  name: 'Home',
  components: {
    Face
  }
}
</script>

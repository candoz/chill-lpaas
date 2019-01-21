<template>
  <td v-bind:class="[color]">
    {{piece}}
  </td>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: [
    'x',
    'y'
  ],
  computed: {
    piece () {
      return this.$store.state.chessboard[this.x][this.y].piece // .piece
    },
    color () {
      return (this.x + this.y) % 2 === 0 ? 'light' : 'dark'
    }
  }
}
</script>

<style lang="scss">

.dark {
  background-color: black
}

.light {
  background-color: white
}

</style>

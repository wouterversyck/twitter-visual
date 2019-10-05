<template>
  <div class="about">
    <h1>Enter to stream</h1>
    <StreamComponent></StreamComponent>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import StreamComponent from '@/components/StreamComponent.vue'; // @ is an alias to /src

@Component({
  components: {
    StreamComponent
  }
})
export default class Twitter extends Vue {}
</script>

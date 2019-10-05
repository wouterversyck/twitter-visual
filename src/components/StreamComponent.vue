<template>
  <div>
    <input v-stream:keyup="click" type="text" />
    <div>
      <div v-for="item in tweets" v-bind:key="item.id">
        <figure>
          <img
            v-bind:src="item.user.profile_image_url_https"
            alt="profile_image"
          />
          <figcaption>
            {{ item.user.name }} {{ item.user.profileImageUrlHttps }}
          </figcaption>
        </figure>
        <p>{{ item.text }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Inject, Prop, Vue } from 'vue-property-decorator';
import TwitterService from '@/core/services/twitter.service';
import { Tweet } from '@/core/models/tweet.model';
import {
  Subject,
  Subscription,
  timer
} from 'rxjs';
import {
  debounce,
  filter,
  map,
  switchMap,
  throttle,
  throttleTime
} from 'rxjs/operators';
@Component
export default class Twitter extends Vue {
  @Prop() private msg!: string;
  @Inject('twitterService') private twitterService!: TwitterService;

  tweets: Tweet[] = [];

  click = new Subject();
  eventSource: Subscription;

  constructor() {
    super();
    this.eventSource = this.click
      .pipe(
        debounce(() => timer(1000)),
        throttleTime(5000),
        map((e: any) => e.event.target.value),
        filter((e: string) => e !== ''),
        switchMap(e => this.getTweets(e)),
        throttle(val => timer(1000))
      )
      .subscribe((e: Tweet) => this.appendToTweets(e));
  }

  beforeDestroy() {
    this.click.unsubscribe();
    this.eventSource.unsubscribe();
  }

  getTweets(track: string) {
    this.tweets = [];
    return this.twitterService.getTweets(track);
  }

  private appendToTweets(tweet: Tweet) {
    this.tweets.unshift(tweet);
    if (this.tweets.length > 5) {
      this.tweets.pop();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>

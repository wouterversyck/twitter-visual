<template>
  <div>
    <h2 v-if="showError">{{ showError }}</h2>
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
import { EMPTY, Subject, Subscription, timer } from 'rxjs';
import {
  catchError,
  debounce,
  delay,
  filter,
  map,
  retryWhen,
  switchMap,
  take,
  throttle
} from 'rxjs/operators';
@Component
export default class Twitter extends Vue {
  @Prop() private msg!: string;
  @Inject('twitterService') private twitterService!: TwitterService;

  tweets: Tweet[] = [];

  click = new Subject();
  eventSource: Subscription;
  showError = '';

  constructor() {
    super();
    this.eventSource = this.click
      .pipe(
        debounce(() => timer(1000)),
        map((e: any) => e.event.target.value),
        filter((e: string) => e !== ''),
        switchMap(e =>
          this.getTweets(e).pipe(
            retryWhen(errors => {
              this.showErrorMessage('Retry in 10 seconds');
              return errors.pipe(
                delay(30000),
                take(2)
              );
            })
          )
        ),
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

  private showErrorMessage(message: string) {
    this.showError = message;
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

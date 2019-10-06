import { Observable } from 'rxjs';
import { Tweet } from '@/core/models/tweet.model';

export default class TwitterService {
  getTweets(params: string): Observable<Tweet> {
    return new Observable(observer => {
      const eventSource = new EventSource(`/tweet?track=${params}`);
      eventSource.onmessage = (event: MessageEvent) =>
        observer.next(JSON.parse(event.data));
      eventSource.onerror = (event: Event) => observer.error(event);

      return () => {
        eventSource.close();
      };
    });
  }
}

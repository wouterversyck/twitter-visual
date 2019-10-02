import { Observable } from 'rxjs';

export default class TwitterService {
  getTweets(params: string) {
    return new Observable(observer => {
      const eventSource = new EventSource(`/tweet?track=${params}`);
      eventSource.onmessage = x => observer.next(x.data);
      eventSource.onerror = x => observer.error(x);

      return () => {
        eventSource.close();
      };
    });
  }
}

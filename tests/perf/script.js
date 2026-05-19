import http from 'k6/http';
import { check, sleep } from 'k6';

// Light, polite load against JSONPlaceholder's public test API.
// 5 virtual users for 20 seconds — ~100 requests, well within their fair-use.
export const options = {
  vus: 5,
  duration: '20s',
  thresholds: {
    // 95th-percentile request must complete under 800ms
    http_req_duration: ['p(95)<800'],
    // less than 1% of requests may fail
    http_req_failed: ['rate<0.01'],
    // every check assertion must pass at least 99% of the time
    checks: ['rate>0.99'],
  },
};

export default function () {
  const res = http.get('https://jsonplaceholder.typicode.com/posts/1');

  check(res, {
    'status is 200': (r) => r.status === 200,
    'body has title': (r) => {
      try {
        return typeof JSON.parse(r.body).title === 'string';
      } catch {
        return false;
      }
    },
  });

  sleep(1);
}

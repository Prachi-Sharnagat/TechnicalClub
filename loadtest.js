
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://127.0.0.1:4173';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '30s', target: 25 },
    { duration: '30s', target: 50 },
    { duration: '30s', target: 100 },
    { duration: '30s', target: 250 },
    { duration: '30s', target: 500 },
      { duration: '30s', target: 750 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1000'],
  },
};

const routes = [
  '/',
  '/domains',
  '/members',
  '/events',
  '/register',
];

export default function () {
  const route = routes[Math.floor(Math.random() * routes.length)];
  const response = http.get(`${BASE_URL}${route}`, {
    tags: { page: route },
  });

  check(response, {
    [`${route} returns HTTP 200`]: (r) => r.status === 200,
    'HTML response is not empty': (r) => r.body && r.body.length > 0,
  });

  sleep(1);
}

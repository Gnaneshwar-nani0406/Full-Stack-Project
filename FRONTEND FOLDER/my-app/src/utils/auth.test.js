import { buildLoginPayload, buildRegistrationAttempts, buildRegistrationPayloads, extractAuthData } from './auth';

describe('auth helpers', () => {
  it('builds a login payload that includes both email and username', () => {
    const payload = buildLoginPayload({ email: 'user@example.com', password: 'secret123' });

    expect(payload).toEqual({
      email: 'user@example.com',
      username: 'user@example.com',
      password: 'secret123',
    });
  });

  it('builds a list of registration payloads for common backend formats', () => {
    const payloads = buildRegistrationPayloads({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'secret123',
      confirm: 'secret123',
    });

    expect(payloads[0]).toMatchObject({ name: 'Jane Doe', email: 'jane@example.com', password: 'secret123' });
    expect(payloads[1]).toMatchObject({ username: 'janedoe', email: 'jane@example.com', password: 'secret123' });
    expect(payloads[2]).toMatchObject({ username: 'janedoe', email: 'jane@example.com', password1: 'secret123', password2: 'secret123' });
  });

  it('builds endpoint and payload combinations for registration attempts', () => {
    const attempts = buildRegistrationAttempts({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'secret123',
      confirm: 'secret123',
      registerEndpoint: 'http://127.0.0.1:8000/api/register/',
    });

    expect(attempts[0]).toMatchObject({ endpoint: 'http://127.0.0.1:8000/api/register/' });
    expect(attempts[0].payload).toMatchObject({ name: 'Jane Doe', email: 'jane@example.com', password: 'secret123' });
    expect(attempts.at(-1)).toMatchObject({ endpoint: 'http://127.0.0.1:8000/api/signup/' });
  });

  it('extracts a token from common login response shapes', () => {
    expect(extractAuthData({ token: 'abc123' })).toMatchObject({ token: 'abc123' });
    expect(extractAuthData({ data: { access_token: 'xyz789' } })).toMatchObject({ token: 'xyz789' });
    expect(extractAuthData({ user: { email: 'user@example.com' } })).toMatchObject({ email: 'user@example.com' });
  });
});

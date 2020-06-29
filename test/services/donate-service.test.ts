import assert from 'assert';
import app from '../../src/app';

describe('\'donate-service\' service', () => {
  it('registered the service', () => {
    const service = app.service('donate-service');

    assert.ok(service, 'Registered the service');
  });
});

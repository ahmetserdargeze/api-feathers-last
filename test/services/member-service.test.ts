import assert from 'assert';
import app from '../../src/app';

describe('\'member-service\' service', () => {
  it('registered the service', () => {
    const service = app.service('member-service');

    assert.ok(service, 'Registered the service');
  });
});

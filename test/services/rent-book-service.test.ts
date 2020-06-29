import assert from 'assert';
import app from '../../src/app';

describe('\'rentBookService\' service', () => {
  it('registered the service', () => {
    const service = app.service('rent-book-service');

    assert.ok(service, 'Registered the service');
  });
});

import assert from 'assert';
import app from '../../src/app';

describe('\'library_book_operation_service\' service', () => {
  it('registered the service', () => {
    const service = app.service('library-book-operation-service');

    assert.ok(service, 'Registered the service');
  });
});

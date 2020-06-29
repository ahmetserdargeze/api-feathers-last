// Initializes the `library_book_operation_service` service on path `/library-book-operation-service`
import {Id, Params, ServiceAddons} from '@feathersjs/feathers';
import {Application} from '../../declarations';
import hooks from './library_book_operation_service.hooks';
import LibraryBranch from "../../models/library_branch.model";


export default function (app: Application) {
  // Initialize our service with any options it requires
  // app.use('/library-book-operation-service', new LibraryBookOperationService(options, app));

  app.use('/library-book-operation-service', {
    async get(id: Id, params?: Params): Promise<any> {
      return "test"
    }, async find(params?: Params): Promise<any> {
      const lib = LibraryBranch(app);
      const resp = await lib.create({
        "library_name": "asdasdasd"
      });
      const deneme = await lib.findAll({
        where: {
          library_name: "aaaa"
        }
      })
      return Promise.resolve(deneme);

    }
  })

  // Get our initialized service so that we can register hooks
  const service = app.service('library-book-operation-service');

  service.hooks(hooks);
}

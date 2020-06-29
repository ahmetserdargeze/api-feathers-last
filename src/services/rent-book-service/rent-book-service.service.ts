// Initializes the `rentBookService` service on path `/rent-book-service`
import {Id, Params, ServiceAddons} from '@feathersjs/feathers';
import {Application} from '../../declarations';
import hooks from './rent-book-service.hooks';
import LibraryBranch from "../../models/library_branch.model";
import RentBusinessService from "./rent-business-service"



export default function (app: Application) {

  const rentBusinessService = new RentBusinessService(app)

  app.use('/rent-book-service', {
    async create(params: any) {
    return  await rentBusinessService.createRentABookService(params);
    }, async get(id: Id, params?: Params): Promise<any> {
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

  const service = app.service('rent-book-service');

  service.hooks(hooks);
}

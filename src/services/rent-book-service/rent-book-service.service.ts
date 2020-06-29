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
      return await rentBusinessService.createRentABookService(params);
    }, async update(data: any, params: any) {
      return await rentBusinessService.giveBackLibraryItem(params);
    }
  })

  const service = app.service('rent-book-service');

  service.hooks(hooks);
}

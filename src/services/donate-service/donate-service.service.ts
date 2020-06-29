// Initializes the `donate-service` service on path `/donate-service`
import {ServiceAddons} from '@feathersjs/feathers';
import {Application} from '../../declarations';
import hooks from './donate-service.hooks';
import RentBusinessService from "../rent-book-service/rent-business-service";
import DonateBusinessService from "./donate-business-service";

export default function (app: Application) {
  const options = {
    paginate: app.get('paginate')
  };

  const donateBusinessService = new DonateBusinessService(app);

  // Initialize our service with any options it requires

  app.use('/donate-service', {
    async create(params: any) {
      return await donateBusinessService.donateLibraryItemService(params);
    },async remove(id:any,params: any) {
      console.log(params);
      return await donateBusinessService.removeOldItems(params.query.day_count);
    }
  })
  // Get our initialized service so that we can register hooks
  const service = app.service('donate-service');

  service.hooks(hooks);
}

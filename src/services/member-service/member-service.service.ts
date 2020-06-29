// Initializes the `member-service` service on path `/member-service`
import {Application} from '../../declarations';
import hooks from './member-service.hooks';
import MemberBusinessService from "./member-business-service";


export default function (app: Application) {
  // Initialize our service with any options it requires
  const memberBusinessService = new MemberBusinessService(app);
  app.use('/member-service', {
    async create(params: any) {
      return await memberBusinessService.registerMemberService(params);
    }
  })
  // Get our initialized service so that we can register hooks
  const service = app.service('member-service');
  service.hooks(hooks);
}

/*
import {Id, NullableId, Paginated, Params, ServiceMethods} from '@feathersjs/feathers';
import {Application} from '../../declarations';
import LibraryBranch from "../../models/library_branch.model";

interface Data {
}

interface ServiceOptions {
}

export class LibraryBookOperationService implements ServiceMethods<Data> {
  app: Application;
  options: ServiceOptions;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  async find(params?: Params): Promise<any> {
    const lib = LibraryBranch(this.app);
    await lib.create({
      "library_name": "asdasdasd"
    }).then(function (result: any) {
      return Promise.resolve(result);
    }).catch(function (e) {
      return Promise.reject(e);
    })
  }

  async get(id: Id, params?: Params): Promise<any> {
    return "test"
    // const lib = LibraryBranch(this.app);
    // const test = await this.test();
    // return Promise.resolve(test);

  }

  async test() {
    const lib = LibraryBranch(this.app);
    return await lib.create({
      "library_name": "asdasdasd"
    })

  }

  async create(data: Data, params?: Params): Promise<Data> {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    return data;
  }

  async update(id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data;
  }

  async patch(id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data;
  }

  async remove(id: NullableId, params?: Params): Promise<Data> {
    return {id};
  }
}
*/

import {HookContext} from "@feathersjs/feathers";


export default {
  before: {
    all: [async (context: HookContext) => {
      console.log("sadsadas")
      return context;
    }],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};

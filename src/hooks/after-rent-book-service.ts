// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';

export default (options = {}): Hook => {
  return async (context: HookContext) => {
    const result = context.result;
    console.log(result);
    // if (result.status === "RENTED"){
    //   const itemFk =result.details.dataValues.library_item_instance_fk;
    //   if(itemFk != null){
    //
    //
    //   }
    //
    // }
    return context;
  };
}

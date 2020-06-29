import LibraryItemModel from "../../models/library_item.model";
import LibraryItemInstanceModel from "../../models/library_item_instance.model";
import LibraryItemInstanceHistoryModel from "../../models/library_item_instance_history.model";
import LibraryBranchMember from "../../models/library_branch_member.model";
import {Sequelize, where} from "sequelize";
import {Application} from "../../declarations";
import LibraryBranch from "../../models/library_branch.model";
import LibraryItemOnHoldHistoryModel from "../../models/library_item_on_hold_history.model";

interface BaseService {
  app: Application
  db: Sequelize
}

interface createRentBookServiceInput {
  "library_item_id": string,
  "renter_member_id": string

}

interface giveBackLibraryItemInput {
  "library_item_instance_history_id": string,
  "library_item_instance_id": string,
  "renter_member_id": string

}


class RentBusinessService implements BaseService {
  app: Application;
  db: Sequelize;

  constructor(app: Application) {
    this.app = app;
    this.db = app.get('sequelizeClient')

  }


  private async checkItemHasAnyAvailableInstance(params: createRentBookServiceInput) {
    const lib = LibraryItemModel(this.app);
    const isHaveActiveInstance = await this.db.query(
      'select  library_item_instance_id from library_item_instance where library_instance_status = 1 and library_item_fk = (?) and library_branch_fk in (select  library_branch_member.library_branch_fk from  library_branch_member where  member_id = (?) limit 1) ',
      {
        replacements: [[params.library_item_id], [params.renter_member_id]],
      }
    );
    const jsonString = JSON.stringify(isHaveActiveInstance); //convert to string to remove the sequelize specific meta data
    const obj = JSON.parse(jsonString);
    if (obj != null && obj[0][0] != undefined && obj[0][0].library_item_instance_id != undefined) {
      //this case return any available instance and user rent the library item
      const availableInstanceId = obj[0][0].library_item_instance_id;
      return availableInstanceId;
    } else {
      return null;
    }
  }

  async createRentABookService(params: createRentBookServiceInput) {
    const libraryItemInstance = await this.checkItemHasAnyAvailableInstance(params);
    if (libraryItemInstance != null) {
      const libraryItemInstanceHistoryModel = LibraryItemInstanceHistoryModel(this.app);
      const createInput = {
        'library_item_instance_fk': libraryItemInstance,
        'library_item_instance_renter_fk': params.renter_member_id,

      }
      const response = await libraryItemInstanceHistoryModel.create(createInput);
      if (response != null) {
        await this.updateStatusItemInstance(2, libraryItemInstance)
        return {
          "status": "RENTED",
          "description": "Rent operation completed",
          "details": response
        }
      } else {
        return {
          "status": "RENTED_ERROR",
          "description": "Rent operation not completed please try again",
          "details": response
        }
      }
    } else {
      return await this.holdAnItem(params.library_item_id, params.renter_member_id)
    }
  }

  private async updateStatusItemInstance(status: number, libraryItemInstanceId: string) {
    console.log(`library item intance   update start status:${status} and libraryItemInstanceId id:${libraryItemInstanceId}`)
    const libraryItemInstanceModel = LibraryItemInstanceModel(this.app);
    await libraryItemInstanceModel.update(
        {library_instance_status: status},
        {where: {library_item_instance_id: libraryItemInstanceId}}
      );


    console.log(`library item intance`)

  }

  private async updateStatusItemHistory(status: boolean, library_item_instance_history_id: string) {
    console.log(`library item intance history  update start status:${status} and history id:${library_item_instance_history_id}`)
    const libraryItemInstanceHistoryModel = LibraryItemInstanceHistoryModel(this.app);
    await libraryItemInstanceHistoryModel.update(
      {is_active: status, rent_end_date: new Date()},
      {where: {library_item_instance_history_id: library_item_instance_history_id}}
    );
    console.log(`library item intance history success`);

  }

  private async holdAnItem(itemId: String, renterFk: string) {
    const libraryItemOnHoldHistoryModel = LibraryItemOnHoldHistoryModel(this.app);
    if (itemId != null && renterFk != null) {
      const createInput = {
        "library_item_fk": itemId,
        "on_hold_member_fk": renterFk
      }
      const response = await libraryItemOnHoldHistoryModel.create(createInput);
      if (response != null) {
        return {
          "status": "ON_HOLD",
          "description": "Item not available so we queued you",
          "details": response
        }
      } else {
        return {
          "status": "ON_HOLD_ERROR",
          "description": "Item not available so we try queued you but this operation failed please try again",
          "details": response
        }

      }
    }
  }


  private async findLibraryItemIdWithInstanceId(library_item_instance_id: string) {
    const lib = LibraryItemInstanceModel(this.app);
    const libraryItemInstance = await lib.findOne({
      where: {
        library_item_instance_id: library_item_instance_id
      }
    });

    const libraryItemId = libraryItemInstance?.getDataValue("library_item_fk");
    console.log(`libraryItemId is :${libraryItemId}`);
    if (libraryItemId != undefined) {
      return libraryItemId;
    } else {
      console.log("Item not found")
      return null;
    }
  }


  async giveBackLibraryItem(params: giveBackLibraryItemInput) {
    try {
      await this.updateStatusItemHistory(false, params.library_item_instance_history_id);
      await this.updateStatusItemInstance(1, params.library_item_instance_id);
      console.log("give back  update operation success")
      const libraryItemId = await this.findLibraryItemIdWithInstanceId(params.library_item_instance_id);
      if (libraryItemId != null) {
        const onHoldResponse = await this.onHoldConvertToRent(libraryItemId, params.library_item_instance_id);
        if (onHoldResponse != undefined && onHoldResponse != null) {
          if (onHoldResponse.rentedMemberFk != "") {
            await this.updateOnHoldStatus(libraryItemId, params.renter_member_id, false);
            return {
              "status": "GIVE_BACK_SUCCESS_ON_HOLD_SUCCESS",
              "description": "Item giveback  operation success and waiter operation execute with success",
              "details": {
                "renter_member_fk": onHoldResponse.rentedMemberFk,
                "rented_item_instance_fk": params.library_item_instance_id
              }
            }
          } else {
            return {
              "status": "GIVE_BACK_SUCCESS_ON_HOLD_SUCCESS",
              "description": "Item giveback  operation success and waiter operation execute with success but any waiters found",
            }
          }

        } else {
          return {
            "status": "GIVE_BACK_SUCCESS_ON_HOLD_ERROR",
            "description": "Item giveback  operation success and waiter operation execute with error",
          }
        }


      } else {
        return {
          "status": "GIVE_BACK_SUCCESS",
          "description": "Item giveback  operation success and waiter operation not apply",
        }
      }
    }
    catch (e) {
      console.log("give back operation failed"+e)
      return {
        "status": "GIVE_BACK_ERROR",
        "description": "Item giveback update operation failed please try again",
      }
    }

  }

  private async updateOnHoldStatus(libraryItemFk: string, member_fk: string, is_active: boolean) {
    console.log(`updateOnHoldStatus start is_active:${is_active} and item id:${libraryItemFk} and member id : ${member_fk}`)
    const libraryItemOnHoldHistoryModel = LibraryItemOnHoldHistoryModel(this.app);
    await libraryItemOnHoldHistoryModel.update(
      {is_active: is_active, update_date: new Date()},
      {where: {library_item_fk: libraryItemFk, on_hold_member_fk: member_fk}}
    );
    console.log(`updateOnHoldStatus end`);
  }


  private async onHoldConvertToRent(library_item_id: string, library_instance_id: string) {
    const libraryItemOnHolder = LibraryItemOnHoldHistoryModel(this.app);
    const libraryItemInstanceHistory = LibraryItemInstanceHistoryModel(this.app);
    const onHolderItem = await libraryItemOnHolder.findOne({
      where: {
        library_item_fk: library_item_id
      },
      order: [
        ['create_date', 'ASC'],
      ],
    })
    const memberFk = onHolderItem?.getDataValue('on_hold_member_fk');
    if (onHolderItem != undefined && memberFk != undefined) {
      console.log(`libraryItem holder  find member fk :  ${memberFk}`);
      const createInput = {
        library_item_instance_fk: library_instance_id,
        library_item_instance_renter_fk: memberFk
      }
      try {
        await libraryItemInstanceHistory.create(createInput);
        await this.updateStatusItemInstance(2, library_instance_id);
        return {
          rentedMemberFk: memberFk
        }
      } catch (e) {
        console.log(`error occured from create library item instance or update item instance status ${e}`);
        return null;
      }
    } else {
      console.log(`on hold queue is empty`);
      return {
        rentedMemberFk: ""
      }
    }


  }
}

export default RentBusinessService;

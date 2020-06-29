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

interface createRentBookServiceResponse {

  "library_item_instance_history_id": string,
  "is_active": boolean,
  "library_item_instance_fk": string,
  "library_item_instance_renter_fk": string,
  "rent_start_date": Date
  "rent_end_date": Date

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
    const libraryItemInstanceModel = LibraryItemInstanceModel(this.app);
    libraryItemInstanceModel.update(
      {library_instance_status: 2},
      {where: {library_item_instance_id: libraryItemInstanceId}}
    );
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
}

export default RentBusinessService;

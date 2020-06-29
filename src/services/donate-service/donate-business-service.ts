import LibraryItemModel from "../../models/library_item.model";
import LibraryItemInstanceModel from "../../models/library_item_instance.model";
import {Op, Sequelize} from "sequelize";
import {Application} from "../../declarations";
import Author from "../../models/author.model";
import LibraryItemInfoModel from "../../models/library_item_info.model";
import LibraryItemInstanceOwnershipInformationModel
  from "../../models/library_item_instance_ownership_information.model";
import LibraryBranchMember from "../../models/library_branch_member.model";
import moment from "moment";

interface BaseService {
  app: Application
  db: Sequelize
}

interface donateLibraryItemInput {
  donated_member_fk: string,
  author_name: string,
  library_item_name: string,
  library_item_published_date: string,
  count: number,
  item_type: number

}


class DonateBusinessService implements BaseService {
  app: Application;
  db: Sequelize;

  constructor(app: Application) {
    this.app = app;
    this.db = app.get('sequelizeClient')

  }


  async donateLibraryItemService(params: donateLibraryItemInput) {
    // checkAuthorExist
    console.log("start donate library item service");
    const authorFk = await this.checkAuthorExist(params.author_name);
    console.log(`author fk is ${authorFk}`)
    const libraryItemFk = await this.checkItemExist(params.library_item_name, authorFk, params.library_item_published_date, params.item_type);
    console.log(`library item  fk is ${libraryItemFk}`)
    const libraryBranchFk = await this.getMemberBranchFk(params.donated_member_fk);
    console.log(`library branch fk is ${libraryBranchFk}`)
    await this.createLibraryItemInstance(libraryBranchFk, libraryItemFk, params.count, params.donated_member_fk);
    return {
      "status": "DONATE_SUCCESS",
      "description": `Item donation success with member ${params.donated_member_fk}`,
    }

  }

  private async checkAuthorExist(author_name: string) {
    const authorModel = Author(this.app);
    const author = await authorModel.findOne({
      where: {
        author_name: author_name
      }
    })
    if (author?.getDataValue("author_id") != undefined && author?.getDataValue("author_id") != null) {
      return author?.getDataValue("author_id");

    } else {
      const createInput = {
        author_name: author_name
      }
      const createdAuthor = await authorModel.create(createInput);
      return createdAuthor.getDataValue('author_id');
    }

  }


  private async checkItemExist(library_item_name: string, library_item_author_fk: string, library_item_published_date: string, library_item_type_fk: number) {
    const libraryItemInfoModel = LibraryItemInfoModel(this.app);
    const libraryItemModel = LibraryItemModel(this.app);


    const libraryItemInfo = await libraryItemInfoModel.findOne({
      where: {
        library_item_name: library_item_name,
        library_item_author_fk: library_item_author_fk,
        library_item_published_date: moment(library_item_published_date, 'YYYY-MM-DD').format("YYYY-MM-DD")
      }
    })

    console.log(moment(library_item_published_date, 'YYYY-MM-DD').format("YYYY-MM-DD"));
    let libraryItemId = libraryItemInfo?.getDataValue("library_item_fk");
    console.log(`libraryItem ${libraryItemId}`)
    console.log(`libraryItem ${JSON.stringify(libraryItemInfo)}`)
    if (libraryItemId != undefined && libraryItemId != null) {
      return libraryItemId;
    } else {
      const libraryItem = await libraryItemModel.create({
        library_item_type_fk: library_item_type_fk
      })
      libraryItemId = libraryItem.getDataValue('library_item_id')
      console.log(`New item  create id is ${libraryItemId}`)
      const createLibraryItemInfo = await libraryItemInfoModel.create({
        library_item_fk: libraryItemId,
        library_item_author_fk: library_item_author_fk,
        library_item_published_date: library_item_published_date,
        library_item_name: library_item_name
      });
      console.log(`New item info created `)
      return libraryItemId
    }
  }

  private async createLibraryItemInstance(library_branch_fk: string, library_item_id: string, count: number, owner_fk: string) {
    const libraryItemInstance = LibraryItemInstanceModel(this.app);
    const libraryItemInstanceOwnershipInformation = LibraryItemInstanceOwnershipInformationModel(this.app);
    const instances = [];
    for (let i = 0; i < count; i++) {
      const instance = {
        library_instance_status: 3,
        library_item_fk: library_item_id,
        library_branch_fk: library_branch_fk
      }
      instances.push(instance);
    }
    console.log(`insert instances length is ${instances.length}`)
    await libraryItemInstance.bulkCreate(instances);
    const newInstanceList = await libraryItemInstance.findAll({
      where: {library_instance_status: 3},
      attributes: ['library_item_instance_id']
    })
    console.log(`bulk create comptleted ${JSON.stringify(newInstanceList)}`)
    const newItemInstanceOwnershipInstances = [];
    for (const resultSetItem of newInstanceList) {
      const createItemInput = {
        library_item_instance_fk: resultSetItem.getDataValue('library_item_instance_id'),
        ownership_status_fk: 2,
        library_branch_fk: library_branch_fk,
        owner_fk: owner_fk,
      }
      newItemInstanceOwnershipInstances.push(createItemInput);
    }
    console.log(`before item instance ownership length ${newItemInstanceOwnershipInstances.length}`)
    await libraryItemInstanceOwnershipInformation.bulkCreate(newItemInstanceOwnershipInstances);
    console.log(`after item instance ownership completed`)
    await libraryItemInstance.update(
      {library_instance_status: 1},
      {where: {library_instance_status: 3}}
    );


    console.log(`after item instance status update`)


  }

  private async getMemberBranchFk(member_id: string) {
    const memberModel = LibraryBranchMember(this.app);
    const member = await memberModel.findOne({
      where: {
        member_id: member_id
      }
    })
    return member?.getDataValue('library_branch_fk');

  }

  async removeOldItems(daysCount: number) {
    console.log(`remove old items grather than ${daysCount} days`)
    const libraryItemInstanceOwnershipInformationModel = LibraryItemInstanceOwnershipInformationModel(this.app);
    const libraryItemInstanceModel = LibraryItemInstanceModel(this.app);
    const newInstanceList = await libraryItemInstanceOwnershipInformationModel.findAll({
      where: {
        createdAt: {
          [Op.lte]: moment().subtract(daysCount, 'days').toDate()
        }
      },
      attributes: ['library_item_instance_fk']
    })
    let instanceIdList = [];
    for (const resultSetItem of newInstanceList) {
      instanceIdList.push(resultSetItem.getDataValue('library_item_instance_fk'))
    }
    console.log(`instanceIdList size ${instanceIdList.length} `)

    if (instanceIdList.length > 0) {
      const updatesResult1 = await libraryItemInstanceModel.update(
        {library_instance_status: 4},
        {
          where: {
            library_item_instance_id: instanceIdList
          }
        }
      );

      console.log(`updatesResult1 is ${JSON.stringify(updatesResult1)} `)


      const updatesResult2 = await libraryItemInstanceOwnershipInformationModel.update(
        {is_deleted: true},
        {
          where: {
            library_item_instance_fk: instanceIdList
          }
        }
      );
      console.log(`updatesResult2 is ${JSON.stringify(updatesResult2)} `)
      if (updatesResult1 != undefined && updatesResult1 != null && updatesResult2 != null && updatesResult2 != undefined && updatesResult1 == updatesResult2) {
        return {
          "status": "OLD_ITEM_INSTANCE_REMOVED",
          "description": `${updatesResult1} Items removed from intance and ownership table`,
        }
      } else {
        return {
          "status": "OLD_ITEM_NOT_FOUND",
          "description": `${daysCount} ago added item not found`,
        }
      }
    } else {
      return {
        "status": "OLD_ITEM_NOT_FOUND",
        "description": `${daysCount} ago added item not found`,
      }
    }


  }


}

export default DonateBusinessService;

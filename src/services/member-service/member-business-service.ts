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

interface registerMemberServiceInput {
  member_mail_adress: string,
  member_password: string,
  library_branch_fk: string,
  member_type_fk: number
}


class MemberBusinessService implements BaseService {
  app: Application;
  db: Sequelize;

  constructor(app: Application) {
    this.app = app;
    this.db = app.get('sequelizeClient')

  }


  async registerMemberService(params: registerMemberServiceInput) {
    const libraryBranchMember = LibraryBranchMember(this.app);
    const member = await libraryBranchMember.create({
      member_mail_address: params.member_mail_adress,
      member_password: params.member_password,
      library_branch_fk: params.library_branch_fk,
      member_type_fk: params.member_type_fk
    })
    const memberId = member.getDataValue('member_id');
    if (memberId != undefined && memberId != null) {
      return {
        "status": "REGISTER_OK",
        "description": ` You are register our library`,
        "details": member
      }
    } else {
      return {
        "status": "REGISTER_ERROR",
        "description": ` You are  not register our library please check your information`,
      }
    }
  }
}


export default MemberBusinessService;

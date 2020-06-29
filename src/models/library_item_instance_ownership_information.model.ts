// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import {Sequelize, DataTypes} from 'sequelize';
import {Application} from '../declarations';

export default function LibraryItemInstanceOwnershipInformationModel(app: Application) {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const libraryItemInstanceOwnershipInformation = sequelizeClient.define('library_item_instance_ownership_information', {
    library_item_instance_fk: {
      type: DataTypes.UUIDV4,
      primaryKey:true,
      references: {
        model: "library_item_instance",
        key: "library_item_instance_id"
      }
    }, ownership_status_fk: {
      type: DataTypes.INTEGER,
      references: {
        model: "ownership_status",
        key: "ownership_status_type"
      }
    }, owner_fk: {
      type: DataTypes.UUIDV4,
      references: {
        model: "library_branch_member",
        key: "member_id"
      }
    }, library_branch_fk: {
      type: DataTypes.UUIDV4,
      references: {
        model: "library_branch",
        key: "library_id"
      }
    }
  }, {
    hooks: {
      beforeCount(options: any) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  (libraryItemInstanceOwnershipInformation as any).associate = function (models: any) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return libraryItemInstanceOwnershipInformation;
}

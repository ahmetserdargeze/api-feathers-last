// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import {Sequelize, DataTypes} from 'sequelize';
import {Application} from '../declarations';
import moment from "moment";

export default function LibraryItemInstanceHistoryModel(app: Application) {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const libraryItemInstanceHistory = sequelizeClient.define('library_item_instance_history', {
    library_item_instance_history_id: {
      type: DataTypes.UUIDV4,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    }, library_item_instance_fk: {
      type: DataTypes.UUIDV4,
      references: {
        model: "library_item_instance",
        key: "library_item_instance_id"
      }
    }, library_item_instance_renter_fk: {
      type: DataTypes.UUIDV4,
      references: {
        model: "library_branch_member",
        key: "member_id"
      }
    }, rent_start_date: {
      type: DataTypes.DATE,
      allowNull:true
    }, rent_end_date: {
      type: DataTypes.DATE,
      allowNull: true
    }, is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    timestamps: false,
    hooks: {
      beforeCount(options: any) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  (libraryItemInstanceHistory as any).associate = function (models: any) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return libraryItemInstanceHistory;
}

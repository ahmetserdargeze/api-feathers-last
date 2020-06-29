// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import {Sequelize, DataTypes} from 'sequelize';
import {Application} from '../declarations';

export default function LibraryItemOnHoldHistoryModel(app: Application) {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const libraryItemOnHoldHistory = sequelizeClient.define('library_item_on_hold_history', {
    library_item_on_hold_history_id: {
      type: DataTypes.UUIDV4,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    library_item_fk: {
      type: DataTypes.UUIDV4,
      defaultValue: DataTypes.UUIDV4,
      references: {
        model: "library_item",
        key: "library_item_id"
      }
    }, on_hold_member_fk: {
      type: DataTypes.UUIDV4,
      defaultValue: DataTypes.UUIDV4,
      references: {
        model: "library_branch_member",
        key: "member_id"
      }
    }, create_date: {
      type: DataTypes.DATE,
    }, update_date: {
      type: DataTypes.DATE,
      allowNull: true
    }, is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
  }, {
    timestamps:false,
    hooks: {
      beforeCount(options: any) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  (libraryItemOnHoldHistory as any).associate = function (models: any) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return libraryItemOnHoldHistory;
}

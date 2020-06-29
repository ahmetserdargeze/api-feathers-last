// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import {Sequelize, DataTypes} from 'sequelize';
import {Application} from '../declarations';

export default function LibraryItemInstanceModel(app: Application) {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const libraryItemInstance = sequelizeClient.define('library_item_instance', {
      library_item_instance_id: {
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      }, library_item_fk: {
        type: DataTypes.UUIDV4,
        references: {
          model: "library_item",
          key: "library_item_id"
        }
      }, library_instance_status: {
        type: DataTypes.INTEGER,
        references: {
          model: "library_item_instance_status",
          key: "library_item_instance_status_type"
        }
      }, library_branch_fk: {
        type: DataTypes.UUIDV4,
        references: {
          model: "library_branch",
          key: "library_id"
        }
      }
    },
    {
      timestamps: false,
      hooks: {
        beforeCount(options: any) {
          options.raw = true;
        }
      }
    }
    )
  ;

// eslint-disable-next-line no-unused-vars
  (libraryItemInstance as any).associate = function (models: any) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return libraryItemInstance;
}

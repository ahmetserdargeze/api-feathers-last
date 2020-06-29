// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import {Sequelize, DataTypes} from 'sequelize';
import {Application} from '../declarations';
import sequelize from "../sequelize";




export default  function LibraryBranch(app: Application) {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const libraryBranch = sequelizeClient.define('library_branch', {
    library_id: {
      type: DataTypes.UUIDV4,
      defaultValue:DataTypes.UUIDV4,
      primaryKey:true
    },
    library_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    hooks: {
      beforeCount(options: any) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  (libraryBranch as any).associate = function (models: any) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return libraryBranch;
}

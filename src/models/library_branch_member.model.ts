// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import {Sequelize, DataTypes} from 'sequelize';
import {Application} from '../declarations';

export default function LibraryBranchMember(app: Application) {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const libraryBranchMember = sequelizeClient.define('library_branch_member', {
    member_id: {
      type: DataTypes.UUIDV4,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    library_branch_fk: {
      type: DataTypes.UUIDV4,
      references: {
        model: "library_branch",
        key: 'library_id'
      }
    }, member_type_fk: {
      type: DataTypes.UUIDV4,
      references: {
        model: "library_branch",
        key: 'library_id'
      }
    }, member_mail_address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }, member_password: {
      type: DataTypes.STRING,
      allowNull: false
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
  (libraryBranchMember as any).associate = function (models: any) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return libraryBranchMember;
}

const tableName = 'page_views';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const opts = {
      charset: 'utf-8',
      schema: 'public',
      underscored: true,
    };

    return queryInterface.createTable(tableName, {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      pageId: {
        type: Sequelize.INTEGER,
        field: 'page_id',
        allowNull: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        field: 'user_id',
        allowNull: true,
      },
      userAgent: {
        type: Sequelize.JSON,
        field: 'user_agent',
      },
      ip: {
        type: Sequelize.STRING,
        field: 'ip',
      },
      countryCode: {
        type: Sequelize.STRING,
        field: 'country_code',
      },
      eventTimestamp: {
        type: 'TIMESTAMP',
        field: 'event_timestamp',
        allowNull: true,
      }
    }, opts);
  },

  down: (queryInterface) => {
    return queryInterface.dropTable(tableName);
  },
};

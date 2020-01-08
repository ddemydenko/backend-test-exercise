const sequelize = require('sequelize');
const { Op } = sequelize;
const geoip = require('geoip-country');
const parser = require('ua-parser-js');

const { PageView } = require('../models');
const CustomError = require('../errors/CustomError');
const RETURN_TIMES_LIMIT = 2;

class PageViewsService {
  list(req) {
    const where = {};
    const { country, browserName, userId, pageId, page, size } = req.query;
    const limit = size || 10;
    const offset = page ? (page - 1) * limit : 0;

    if (country) {
      where.countryCode = country;
    }
    if (userId) {
      where.userId = userId;
    }
    if (pageId) {
      where.pageId = pageId;
    }
    if (browserName) {
      where.userAgent = { browser: { name: { [Op.in]: browserName } } };
    }

    return PageView.findAll({
      attributes: ['id', 'pageId', 'userId', 'userAgent', 'eventTimestamp'],
      where,
      offset,
      limit
    });
  }

   getReturnedUsers(req) {
    const { userId } = req.query;
    const where = {};

    if (userId) {
      where.userId = userId;
    }

    return PageView.count({
      attributes: ['userId'],
      group: ['userId'],
      where: where,
      having: sequelize.where(sequelize.fn('COUNT', '*'), Op.gt, RETURN_TIMES_LIMIT)
    }).then((items) => {
      if (Array.isArray(items)) {
        return items;
      }
      throw new CustomError('Can\'t fetch records from Database', 404);
    });
  }

  create(req) {
    const { pageId, userId, eventTimestamp } = req.body || {};
    const userAgent = parser(req.headers['user-agent']);
    const timestamp = eventTimestamp ? new Date(eventTimestamp * 1000) : null;
    const ip = req.clientIp.split(':').pop();
    //here is plain implementation,
    //would be better to use paid api with some caching mechanism
    const geo = geoip.lookup(ip);

    return PageView.create({
      pageId: pageId,
      userId: userId,
      eventTimestamp: timestamp,
      userAgent: userAgent,
      ip: ip,
      countryCode: (geo && geo.country)
    });
  }
}

module.exports = PageViewsService;

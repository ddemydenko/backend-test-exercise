const sinon = require('sinon');
const { Op } = require('sequelize');
const chai = require('chai');
const { expect } = chai;
const rewire = require('rewire');
const config = require('../config/config');

chai.use(require('chai-http'));
chai.config.includeStack = false;

const { PageView } = require('../models');
let app = rewire('../server');

describe('Page Views Service', () => {
  // eslint-disable-next-line max-len
  const userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36';
  const pageViewMock = {
    pageId: 3,
    userId: 2,
    eventTimestamp: '2020-01-08T11:03:14.000Z',
    userAgent: {
      browser: {
        name: 'Chrome',
      }
    },
    ip: '178.214.223.110',
    countryCode: 'UA'
  };
  const sandbox = sinon.createSandbox();

  before(() => {
    sandbox.stub(PageView);
  });

  after(() => {
    sandbox.reset();
  });
  describe('Error cases on PUT /page-view', () => {
    it('should returns 404 status if route does not exist', async () => {
      const res = await chai.request(app)
        .put('/')
        .send({
          pageId: 3,
          userId: 2,
          eventTimestamp: 1578481394
        })
        .set('x-forwarded-for', '178.214.223.110')
        .set('user-agent', userAgent);

      expect(res).to.have.status(404);
      expect(res.body.message).to.have.string('Swagger Validation Error');
    });

    it('should returns 400 status when auth token was not provided', () => {
      chai.request(app)
        .put('/page-views')
        .send({
          pageId: 3,
          userId: 2,
          eventTimestamp: 1578481394
        })
        .set('x-forwarded-for', '178.214.223.110')
        .set('user-agent', userAgent)
        .end(function (err, res) {
          expect(res).to.have.status(400);
          expect(res.body.message).to.have.string('Swagger Validation Error');
          expect(res.body.message).to.have.string('Authorization');
        });
    });

    it('should returns 401 status when was provided wrong auth token', async () => {
      const revert = app.__set__('console', {
        log: () => {},
        error: () => {}
      });
      const res = await chai.request(app)
        .put('/page-views')
        .send({
          pageId: 3,
          userId: 2,
          eventTimestamp: 1578481394
        })
        .set('x-forwarded-for', '178.214.223.110')
        .set('user-agent', userAgent)
        .set('Authorization', '123');

      expect(res).to.have.status(401);
      expect(res.body.message).to.have.string('Error validation auth token');
      revert();
    });
  });

  describe('Success case on PUT /page-view', () => {
    it('should create page view', async () => {
      PageView.create.callsFake(async (params) => params);
      const res = await chai.request(app)
        .put('/page-views')
        .send({
          pageId: 3,
          userId: 2,
          eventTimestamp: 1578481394
        })
        .set('x-forwarded-for', '178.214.223.110')
        .set('user-agent', userAgent)
        .set('Authorization', config.auth.token);
      expect(res.body.pageId).to.equal(3);
      expect(res.body.userId).to.equal(2);
      expect(res.body.eventTimestamp).to.equal('2020-01-08T11:03:14.000Z');
      expect(res.body.userAgent.browser.name).to.equal('Chrome');
      expect(res.body.ip).to.equal('178.214.223.110');
      expect(res.body.countryCode).to.equal('UA');

    });
  });

  describe('Success case on GET /page-view', () => {
    it('should returns list of page-view records', async () => {
      PageView.findAll.resolves([pageViewMock]);
      const res = await chai.request(app)
        .get('/page-views')
        .set('x-forwarded-for', '178.214.223.110')
        .set('user-agent', userAgent)
        .set('Authorization', config.auth.token);
      expect(res.body[0].pageId).to.equal(3);
      expect(res.body[0].userId).to.equal(2);
      expect(res.body[0].eventTimestamp).to.equal('2020-01-08T11:03:14.000Z');
      expect(res.body[0].userAgent.browser.name).to.equal('Chrome');
      expect(res.body[0].ip).to.equal('178.214.223.110');
      expect(res.body[0].countryCode).to.equal('UA');
    });

    it('should returns contains correct where clause in db query when get by browser', async () => {
      let spyParams;
      PageView.findAll.callsFake(async (params) => {
        spyParams = params;
        return [pageViewMock];
      });

      await chai.request(app)
        .get('/page-views' + '?browserName=Chrome')
        .set('Authorization', config.auth.token);
      expect(spyParams.where.userAgent.browser.name[Op.in]).to.eql(['Chrome']);

      await chai.request(app)
        .get('/page-views' + '?browserName=Chrome&browserName=Firefox')
        .set('Authorization', config.auth.token);
      expect(spyParams.where.userAgent.browser.name[Op.in]).to.eql(['Chrome', 'Firefox']);
    });

    it('should returns contains correct where clause in db query when get userId', async () => {
      let spyParams;
      PageView.findAll.callsFake(async (params) => {
        spyParams = params;
        return [pageViewMock];
      });

      await chai.request(app)
        .get('/page-views' + '?userId=1')
        .set('Authorization', config.auth.token);
      expect(spyParams.where.userId).to.eql([1]);

      await chai.request(app)
        .get('/page-views' + '?userId=1&userId=2')
        .set('Authorization', config.auth.token);
      expect(spyParams.where.userId).to.eql([1, 2]);
    });

    it('should returns contains correct where clause in db query when get pageId', async () => {
      let spyParams;
      PageView.findAll.callsFake(async (params) => {
        spyParams = params;
        return [pageViewMock];
      });

      await chai.request(app)
        .get('/page-views' + '?pageId=1')
        .set('Authorization', config.auth.token);
      expect(spyParams.where.pageId).to.eql([1]);

      await chai.request(app)
        .get('/page-views' + '?pageId=1&pageId=2')
        .set('Authorization', config.auth.token);
      expect(spyParams.where.pageId).to.eql([1, 2]);
    });

    it('should returns contains correct where clause in db query when get countryCode', async () => {
      let spyParams;
      PageView.findAll.callsFake(async (params) => {
        spyParams = params;
        return [pageViewMock];
      });

      await chai.request(app)
        .get('/page-views' + '?country=UA')
        .set('Authorization', config.auth.token);
      expect(spyParams.where.countryCode).to.eql(['UA']);

      await chai.request(app)
        .get('/page-views' + '?country=UA&country=US')
        .set('Authorization', config.auth.token);
      expect(spyParams.where.countryCode).to.eql(['UA', 'US']);
    });
  });

  describe('Success case on GET /returned-users', () => {
    it('should returns list of users who visit the site more than one time', async () => {
      let spyParams;
      PageView.count.callsFake(async (params) => {
        spyParams = params;
        return [pageViewMock];
      });

      await chai.request(app)
        .get('/returned-users')
        .set('Authorization', config.auth.token);
      expect(spyParams.attributes).to.eql(['userId']);
      expect(spyParams.group).to.eql(['userId']);
      expect(spyParams.where).to.eql({});
      expect(spyParams.having).to.eql({
        attribute: {
          fn: 'COUNT',
          args: ['*']
        },
        comparator: Op.gt,
        logic: 2
      });
    });

    it('should returns specific user who visit the site more than one time', async () => {
      let spyParams;
      PageView.count.callsFake(async (params) => {
        spyParams = params;
        return [pageViewMock];
      });

      await chai.request(app)
        .get('/returned-users' + '/?userId=1')
        .set('Authorization', config.auth.token);
      expect(spyParams.attributes).to.eql(['userId']);
      expect(spyParams.group).to.eql(['userId']);
      expect(spyParams.where).to.eql({ userId: '1' });
      expect(spyParams.having).to.eql({
        attribute: {
          fn: 'COUNT',
          args: ['*']
        },
        comparator: Op.gt,
        logic: 2
      });
    });
  });

});


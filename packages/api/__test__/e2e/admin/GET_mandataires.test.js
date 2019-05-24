//

const request = require("supertest");

const { knex } = global;
jest.setMock("@emjpm/api/db/knex", knex);

const server = require("@emjpm/api/app");

const { getTokenByUserType } = require("../utils");

//

beforeAll(async () => {
  await knex.migrate.latest();
  await knex.seed.run();
});

// strip the created_at date in the response
const simpler = ({ created_at, ...props }) => props;

test("should GET mandataires", async () => {
  const token = await getTokenByUserType("admin");
  const response = await request(server)
    .get("/api/v1/admin/mandataires")
    .set("Authorization", "Bearer " + token);

  expect(response.body.map(simpler)).toMatchSnapshot();

  expect(response.status).toBe(200);
});

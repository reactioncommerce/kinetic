import { faker } from "@faker-js/faker";
import { graphql } from "msw";

import { Group } from "types/group";

const mockGroup = (): Group => ({
  _id: faker.datatype.uuid(), name: faker.random.word()
});

const mockUser = (group: Group) => ({
  _id: faker.datatype.uuid(),
  name: faker.random.words(),
  primaryEmailAddress: faker.internet.email(),
  groups: { nodes: [group] }
});

export const groups: Group[] = [mockGroup(), mockGroup()];

export const users = [mockUser(groups[0]), mockUser(groups[1])];


const getUsersHandler = graphql.query("getUsers", (req, res, ctx) =>
  res(ctx.data({ accounts: { nodes: users } })));

const getGroupsHandler = graphql.query("getGroups", (req, res, ctx) =>
  res(ctx.data({ groups: { nodes: groups, totalCount: groups.length } })));


const inviteUserHandler = graphql.mutation("inviteUser", (req, res, ctx) => {
  const { input } = req.variables;
  return res(ctx.data({ input }));
});

const updateUserGroupHandler = graphql.mutation("updateGroupsForAccounts", (req, res, ctx) => {
  const { input } = req.variables;
  return res(ctx.data({ input }));
});

const sendResetPasswordEmailHandler = graphql.mutation("sendResetPasswordEmail", (req, res, ctx) => {
  const { input } = req.variables;
  return res(ctx.data({ input }));
});


export const handlers = [
  getUsersHandler,
  getGroupsHandler,
  inviteUserHandler,
  updateUserGroupHandler,
  sendResetPasswordEmailHandler
];

import { faker } from "@faker-js/faker";
import { graphql } from "msw";

import { Role } from "@graphql/types";
import { Group } from "types/group";

const mockGroup = (permissions: string[]): Group => ({
  _id: faker.datatype.uuid(),
  name: faker.random.word(),
  description: faker.random.words(),
  permissions
});

const mockUser = (group: Group) => ({
  _id: faker.datatype.uuid(),
  name: faker.random.words(),
  primaryEmailAddress: faker.internet.email(),
  groups: { nodes: [group] }
});

const mockPendingInvitation = (group: Group) => ({
  _id: faker.datatype.uuid(),
  email: faker.internet.email(),
  groups: [group],
  invitedBy: mockUser(group)
});

const mockRole = (name: string) => ({
  name,
  _id: faker.datatype.uuid()
});

export const groups: Group[] = [
  mockGroup(["reaction:legacy:accounts/add:address-books", "reaction:legacy:addressValidationRules/read"]),
  mockGroup(["reaction:legacy:emails/read", "reaction:legacy:inventory/read"])
];

export const users = [mockUser(groups[0]), mockUser(groups[1])];

export const pendingInvitations = [mockPendingInvitation(groups[0]), mockPendingInvitation(groups[1])];

export const roles: Role[] = [
  mockRole("reaction:legacy:accounts/add:address-books"),
  mockRole("reaction:legacy:accounts/invite:group"),
  mockRole("reaction:legacy:addressValidationRules/create"),
  mockRole("reaction:legacy:emails/read"),
  mockRole("reaction:legacy:addressValidationRules/read"),
  mockRole("reaction:legacy:inventory/read")
];


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

const updateGroupHandler = graphql.mutation("updateGroup", (req, res, ctx) => {
  const { input } = req.variables;
  return res(ctx.data({ input }));
});

const sendResetPasswordEmailHandler = graphql.mutation("sendResetPasswordEmail", (req, res, ctx) => {
  const { input } = req.variables;
  return res(ctx.data({ input }));
});

const getPendingInvitationsHandler = graphql.query("getPendingInvitations", (req, res, ctx) =>
  res(ctx.data({ invitations: { nodes: pendingInvitations, totalCount: pendingInvitations.length } })));

const getRolesHandler = graphql.query("getRoles", (req, res, ctx) => res(ctx.data({ roles: { nodes: roles } })));

export const handlers = [
  getUsersHandler,
  getGroupsHandler,
  inviteUserHandler,
  updateUserGroupHandler,
  updateGroupHandler,
  sendResetPasswordEmailHandler,
  getPendingInvitationsHandler,
  getRolesHandler
];

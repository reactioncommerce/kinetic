import { Route, useLocation } from "react-router-dom";

import { renderWithRoutes, screen, waitForElementToBeRemoved } from "@utils/testUtils";
import { server, graphql } from "@mocks/server";

import { RequireAuthRoute } from "./RequireAuthRoute";

const ShowPath = () => {
  const { pathname, search } = useLocation();
  return <pre>{`${pathname}${search}`}</pre>;
};

describe("RequireAuthRoute", () => {
  it("should redirect to Login page with redirectUrl when session is expired", async () => {
    server.use(graphql.query("getViewer", (req, res, ctx) =>
      res.once(ctx.data({ viewer: null }))));

    renderWithRoutes({
      initialEntries: ["/promotions", "/login"],
      routes: <>
        <Route element={<RequireAuthRoute/>}>
          <Route path="/promotions" element={<ShowPath/>} />
        </Route>
        <Route path="/login" element={<ShowPath/>} />
      </>
    });

    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar", { hidden: true }));
    const login = await screen.findByText("/login?redirectUrl=/promotions");
    expect(login).toBeInTheDocument();
  });

  it("should render correct page if user already logged in", async () => {
    renderWithRoutes({
      initialEntries: ["/promotions"],
      routes: <>
        <Route element={<RequireAuthRoute/>}>
          <Route path="promotions" element={<ShowPath/>} />
        </Route>
        <Route path="login" element={<ShowPath/>} /></>
    });

    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar", { hidden: true }));

    expect(screen.getByText("/promotions")).toBeInTheDocument();
  });
});

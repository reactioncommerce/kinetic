import { Route, Routes, useLocation } from "react-router-dom";

import { renderWithProviders, screen, waitForElementToBeRemoved } from "@utils/testUtils";
import { server, graphql } from "@mocks/server";

import { RequireAuthRoute } from "./RequireAuthRoute";

const ShowPath = () => {
  const { pathname, search, hash } = useLocation();
  return <pre>{JSON.stringify({ pathname, search, hash })}</pre>;
};

describe("RequireAuthRoute", () => {
  it("should redirect to Login page with redirectUrl when session is expired", async () => {
    server.use(graphql.query("getViewer", (req, res, ctx) =>
      res(ctx.data({ viewer: null }))));

    const { container } = renderWithProviders(<Routes>
      <Route element={<RequireAuthRoute/>}>
        <Route path="promotions" element={<ShowPath/>} />
      </Route>
      <Route path="login" element={<ShowPath/>} />
    </Routes>, { initialEntries: ["/promotions"] });

    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar", { hidden: true }));

    expect(container).toMatchInlineSnapshot(`
      <div>
        <pre>
          {"pathname":"/login","search":"?redirectUrl=/promotions","hash":""}
        </pre>
      </div>
    `);
  });

  it("should render correct page if user already logged in", async () => {
    const { container } = renderWithProviders(<Routes>
      <Route element={<RequireAuthRoute/>}>
        <Route path="promotions" element={<ShowPath/>} />
      </Route>
      <Route path="login" element={<ShowPath/>} />
    </Routes>, { initialEntries: ["/promotions"] });

    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar", { hidden: true }));

    expect(container).toMatchInlineSnapshot(`
      <div>
        <pre>
          {"pathname":"/promotions","search":"","hash":""}
        </pre>
      </div>
    `);
  });
});

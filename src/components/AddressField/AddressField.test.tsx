import { Form, Formik } from "formik";

import { render, screen, fireEvent, within } from "@utils/testUtils";

import { CountryField } from "./CountryField";
import { RegionField } from "./RegionField";

describe("AddressField", () => {
  it("RegionField should populate options based on country value", () => {
    render(<Formik initialValues={{ country: null, region: null }} onSubmit={vi.fn()}>
      <Form>
        <CountryField name="country" label="Country" placeholder="Enter Country"/>
        <RegionField name="region" label="Region" placeholder="Enter Region"/>
      </Form>
    </Formik>);
    fireEvent.mouseDown(screen.getByPlaceholderText("Enter Country"));
    const listbox = within(screen.getByRole("listbox"));

    fireEvent.click(listbox.getByText("Vietnam"));

    expect(screen.getByPlaceholderText("Enter Country")).toHaveDisplayValue("Vietnam");

    fireEvent.mouseDown(screen.getByPlaceholderText("Enter Country"));

    fireEvent.click(within(screen.getByRole("listbox")).getByText("United States"));
    expect(screen.getByPlaceholderText("Enter Country")).toHaveValue("United States");
    fireEvent.mouseDown(screen.getByPlaceholderText("Enter Region"));
    const regionListbox = within(screen.getByRole("listbox"));

    fireEvent.click(regionListbox.getByText("Colorado"));
    expect(screen.getByPlaceholderText("Enter Region")).toHaveValue("Colorado");
  });
});

import { Form, Formik } from "formik";

import { render, screen, fireEvent, within, userEvent } from "@utils/testUtils";

import { AddressField } from "./AddressField";


describe("AddressField", () => {
  it("RegionField should populate options based on country value", () => {
    render(<Formik initialValues={{ country: null, region: null }} onSubmit={vi.fn()}>
      <Form>
        <AddressField
          countryFieldProps={{ name: "country", label: "Country", placeholder: "Enter Country" }}
          regionFieldProps={{
            name: "region", label: "Region", placeholder: "Enter Region"
          }}/>
      </Form>
    </Formik>);
    fireEvent.mouseDown(screen.getByPlaceholderText("Enter Country"));

    fireEvent.click(within(screen.getByRole("listbox")).getByText("Vietnam"));

    expect(screen.getByPlaceholderText("Enter Country")).toHaveDisplayValue("Vietnam");

    fireEvent.mouseDown(screen.getByPlaceholderText("Enter Country"));

    fireEvent.click(within(screen.getByRole("listbox")).getByText("United States"));
    expect(screen.getByPlaceholderText("Enter Country")).toHaveValue("United States");
    fireEvent.mouseDown(screen.getByPlaceholderText("Enter Region"));

    fireEvent.click(within(screen.getByRole("listbox")).getByText("Colorado"));
    expect(screen.getByPlaceholderText("Enter Region")).toHaveValue("Colorado");
  });

  it("RegionField should accept free text value if country does not have states options", async () => {
    const handleSubmit = vi.fn();
    render(<Formik initialValues={{ country: null, region: null }} onSubmit={(value) => handleSubmit(value) }>
      <Form>
        <AddressField
          countryFieldProps={{ name: "country", label: "Country", placeholder: "Enter Country" }}
          regionFieldProps={{
            name: "region", label: "Region", placeholder: "Enter Region"
          }}/>
        <button type="submit">Submit</button>
      </Form>
    </Formik>);

    fireEvent.mouseDown(screen.getByPlaceholderText("Enter Country"));
    fireEvent.click(within(screen.getByRole("listbox")).getByText("Vietnam"));

    expect(screen.getByPlaceholderText("Enter Country")).toHaveValue("Vietnam");
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText("Enter Region"), "Ha Noi");

    await user.click(screen.getByText("Submit"));
    expect(handleSubmit).toBeCalledWith({ country: { value: "VN", label: "Vietnam" }, region: { value: "Ha Noi", label: "Ha Noi" } });
  });


  it("RegionField should not accept an invalid region value", async () => {
    render(<Formik initialValues={{ country: null, region: null }} onSubmit={vi.fn()}>
      <Form>
        <AddressField
          countryFieldProps={{ name: "country", label: "Country", placeholder: "Enter Country" }}
          regionFieldProps={{
            name: "region", label: "Region", placeholder: "Enter Region"
          }}/>
        <button type="submit">Submit</button>
      </Form>
    </Formik>);

    fireEvent.mouseDown(screen.getByPlaceholderText("Enter Country"));
    fireEvent.click(within(screen.getByRole("listbox")).getByText("Vietnam"));
    const user = userEvent.setup();

    fireEvent.mouseDown(screen.getByPlaceholderText("Enter Country"));
    await user.type(screen.getByPlaceholderText("Enter Region"), "Ha Noi");
    fireEvent.click(within(screen.getByRole("listbox")).getByText("United States"));

    await user.click(screen.getByText("Submit"));
    expect(screen.getByPlaceholderText("Enter Region")).toBeInvalid();

    fireEvent.mouseDown(screen.getByPlaceholderText("Enter Region"));
    fireEvent.click(within(screen.getByRole("listbox")).getByText("Arkansas"));
    await user.click(screen.getByText("Submit"));
    expect(screen.getByPlaceholderText("Enter Region")).toBeValid();
  });

  it("RegionField should be reset when country value has changed", async () => {
    render(<Formik initialValues={{ country: null, region: null }} onSubmit={vi.fn()}>
      <Form>
        <AddressField
          countryFieldProps={{ name: "country", label: "Country", placeholder: "Enter Country" }}
          regionFieldProps={{
            name: "region", label: "Region", placeholder: "Enter Region"
          }}/>
        <button type="submit">Submit</button>
      </Form>
    </Formik>);

    fireEvent.mouseDown(screen.getByLabelText("Country"));
    fireEvent.click(within(screen.getByRole("listbox")).getByText("Vietnam"));
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("Region"), "Ha Noi");
    fireEvent.mouseDown(screen.getByLabelText("Country"));
    fireEvent.click(within(screen.getByRole("listbox")).getByText("United States"));
    await user.tab();
    expect(screen.getByLabelText("Region")).toBeInvalid();
    expect(screen.getByLabelText("Region")).toHaveValue("");

    fireEvent.mouseDown(screen.getByLabelText("Country"));
    fireEvent.click(within(screen.getByRole("listbox")).getByText("Angola"));

    await user.click(screen.getByText("Submit"));
    expect(screen.getByLabelText("Region")).toBeValid();
  });
});

"use client";

import {
  Alert,
  Button,
  Calendar,
  Checkbox,
  ConfirmDialog,
  DateInput,
  DateRange,
  Dialog,
  Drawer,
  Input,
  InputError,
  Label,
  LoadingButton,
  Menu,
  MenuItem,
  MenuTrigger,
  OTPInput,
  Pagination,
  RHFCheckbox,
  RHFDateInput,
  RHFError,
  RHFInput,
  RHFOTPInput,
  RHFRadio,
  RHFSelect,
  RHFSwitch,
  RHFTextarea,
  Radio,
  Select,
  SelectOption,
  Spinner,
  Switch,
  Textarea,
  Tooltip,
  toast
} from "@geckoui/geckoui";
import "@geckoui/geckoui/styles.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLayoutEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  bio: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions"
  }),
  notifications: z.boolean(),
  contactMethod: z.string().optional(),
  birthDate: z.string().optional(),
  country: z.string().optional(),
  otp: z.string().length(6, "OTP must be 6 digits")
});

export default function Home() {
  const [isDark, setIsDark] = useState<boolean>(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerPlacement, setDrawerPlacement] = useState<"left" | "right" | "top" | "bottom">(
    "right"
  );
  const [rangeDate, setRangeDate] = useState<DateRange>({
    from: null,
    to: null
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [otpValue, setOtpValue] = useState("");
  const [singleSelectValue, setSingleSelectValue] = useState();
  const [multiSelectValue, setMultiSelectValue] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAlert, setShowAlert] = useState(true);

  const methods = useForm({
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      agreeToTerms: false,
      notifications: false,
      contactMethod: "",
      birthDate: "",
      country: ""
    },
    resolver: zodResolver(formSchema)
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: never) => {
    console.log("Form Data:", data);
    toast.success("Form submitted successfully!");
  };

  const updateTheme = (dark: boolean) => {
    const html = document.documentElement;

    if (dark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }

    localStorage.setItem("theme", dark ? "dark" : "light");
    setIsDark(dark);
  };

  useLayoutEffect(() => {
    setIsDark(localStorage.getItem("theme") === "dark");
  }, []);

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex justify-end">
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg shadow">
              <span className="text-sm ">Theme:</span>
              <div className="flex gap-2">
                <Button
                  variant={!isDark ? "filled" : "outlined"}
                  size="sm"
                  onClick={() => updateTheme(false)}>
                  ☀️ Light
                </Button>
                <Button
                  variant={isDark ? "filled" : "outlined"}
                  size="sm"
                  onClick={() => updateTheme(true)}>
                  🌙 Dark
                </Button>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">@geckoui/geckoui Component Playground</h1>
            <p className="">Comprehensive showcase of all UI components</p>
          </div>

          {/* Section 1: Buttons */}
          <section className="space-y-6 p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold border-b pb-2">Buttons</h2>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold ">Button Variants</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="filled">Filled</Button>
                <Button variant="outlined">Outlined</Button>
                <Button variant="ghost">Text</Button>
                <Button variant="icon">🎯</Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold ">Button Sizes</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="filled" size="xs">
                  Extra Small
                </Button>
                <Button variant="filled" size="sm">
                  Small
                </Button>
                <Button variant="filled" size="md">
                  Medium
                </Button>
                <Button variant="filled" size="lg">
                  Large
                </Button>
                <Button variant="filled" size="xl">
                  Extra Large
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold ">Button States</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="filled">Enabled</Button>
                <Button variant="filled" disabled>
                  Disabled
                </Button>
                <Button variant="outlined">Outlined</Button>
                <Button variant="outlined" disabled>
                  Disabled
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold ">Loading Button</h3>
              <div className="flex flex-wrap gap-4">
                <LoadingButton loading variant="filled">
                  Loading Start
                </LoadingButton>
                <LoadingButton loading spinnerPosition="end" variant="filled">
                  Loading End
                </LoadingButton>
                <LoadingButton loading loadingText="Processing..." variant="outlined">
                  Submit
                </LoadingButton>
                <LoadingButton variant="filled">Not Loading</LoadingButton>
              </div>
            </div>
          </section>

          {/* Section 2: Form Inputs */}
          <section className="space-y-6 p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold border-b pb-2">Form Inputs</h2>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold ">Input</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Basic input" />
                <Input placeholder="With prefix" prefix="$" />
                <Input placeholder="With suffix" suffix=".com" />
                <Input placeholder="Disabled" disabled />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold ">Textarea</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Textarea placeholder="Basic textarea" rows={3} disabled value="Hello world" />
                <Textarea placeholder="Auto-resize textarea" autoResize />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold ">Date Input</h3>
              <div className="max-w-md">
                <DateInput value={selectedDate} onChange={(date) => setSelectedDate(date)} />
              </div>
              <div className="max-w-md">
                <DateInput
                  format="MM/DD/YYYY"
                  value={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                />
              </div>
              <div className="max-w-md">
                <DateInput
                  format="YYYY-MM-DD"
                  separator="-"
                  disabled
                  value={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold ">OTP Input</h3>
              <div className="max-w-md">
                <OTPInput
                  value={otpValue}
                  onChange={setOtpValue}
                  length={6}
                  // disabled
                  onOTPComplete={(otp) => toast.success(`OTP Complete: ${otp}`)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold ">Calendar</h3>
              <Calendar
                selectedDate={selectedDate}
                onSelectDate={(date) => {
                  setSelectedDate(date);
                  toast.info(`Selected: ${date}`);
                }}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold ">Date Range Calendar</h3>
              <Calendar
                mode="range"
                selectedRange={rangeDate}
                onSelectRange={(range) => {
                  if (range) {
                    setRangeDate(range);
                    toast.info(`Selected Range: ${range.from} to ${range.to}`);
                  }
                }}
              />
            </div>
          </section>

          {/* Section 3: Form Controls */}
          <section className="space-y-6  p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold border-b pb-2">Form Controls</h2>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold ">Checkbox</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox id="check1" />
                  <label htmlFor="check1">Normal checkbox</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="check2" partial />
                  <label htmlFor="check2">Partial (indeterminate) checkbox</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="check3" disabled />
                  <label htmlFor="check3" className="">
                    Disabled checkbox
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold ">Radio</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Radio id="radio1" name="radioGroup" />
                  <label htmlFor="radio1">Option 1</label>
                </div>
                <div className="flex items-center gap-2">
                  <Radio id="radio2" name="radioGroup" />
                  <label htmlFor="radio2">Option 2</label>
                </div>
                <div className="flex items-center gap-2">
                  <Radio id="radio3" name="radioGroup" disabled />
                  <label htmlFor="radio3" className="">
                    Disabled option
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold ">Switch</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Switch size="sm" />
                  <span>Small switch</span>
                </div>
                <div className="flex items-center gap-3">
                  <Switch size="md" />
                  <span>Medium switch (default)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Switch disabled />
                  <span>Disabled switch</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold ">Label</h3>
              <div className="space-y-3">
                <Label>Basic label</Label>
                <Label required>Required label</Label>
                <Label tooltip="This is helpful information">Label with tooltip</Label>
                <Label required tooltip="This field is mandatory">
                  Required with tooltip
                </Label>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold ">Input Error</h3>
              <div className="max-w-md space-y-2">
                <Input placeholder="Email" />
                <InputError>Please enter a valid email address</InputError>
              </div>
            </div>
          </section>

          {/* Section 4: Select Components */}
          <section className="space-y-6  p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold border-b pb-2">Select Components</h2>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold ">Single Select</h3>
              <div className="max-w-md">
                <Select
                  value={singleSelectValue}
                  onChange={setSingleSelectValue}
                  placeholder="Choose a fruit"
                  disabled
                  filterable>
                  <SelectOption value="apple" label="Apple" />
                  <SelectOption value="banana" label="Banana" />
                  <SelectOption value="orange" label="Orange" />
                  <SelectOption value="grape" label="Grape" />
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold ">Multi Select</h3>
              <div className="max-w-md">
                <Select
                  value={multiSelectValue}
                  onChange={setMultiSelectValue}
                  placeholder="Choose multiple colors"
                  filterable="dropdown"
                  // disabled
                  multiple>
                  {/* <SelectDropdownSearch /> */}
                  <SelectOption value="red" label="Red" />
                  <SelectOption value="blue" label="Blue" />
                  <SelectOption value="green" label="Green" />
                  <SelectOption value="yellow" label="Yellow" />
                  <SelectOption value="purple" label="Purple" />
                  {Array.from({ length: 20 }, (_, i) => (
                    <SelectOption key={i} value={`color-${i}`} label={`Color ${i + 1}`} />
                  ))}
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold ">Filterable Select</h3>
              <div className="max-w-md">
                <Select
                  value={singleSelectValue}
                  onChange={setSingleSelectValue}
                  placeholder="Search and select a country"
                  filterable>
                  <SelectOption value="us" label="United States" />
                  <SelectOption value="uk" label="United Kingdom" />
                  <SelectOption value="ca" label="Canada" />
                  <SelectOption value="au" label="Australia" />
                  <SelectOption value="de" label="Germany" />
                  <SelectOption value="fr" label="France" />
                </Select>
              </div>
            </div>
          </section>

          {/* Section 5: React Hook Form Components */}
          <section className="space-y-6  p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold border-b pb-2">React Hook Form Components</h2>

            <form onSubmit={handleSubmit(onSubmit as never)} className="space-y-6 max-w-2xl">
              <div className="space-y-2">
                <Label required>Name</Label>
                <RHFInput name="name" placeholder="Enter your name" />
                <RHFError name="name" />
              </div>

              <div className="space-y-2">
                <Label required>Email</Label>
                <RHFInput name="email" placeholder="your@email.com" />
                <RHFError name="email" />
              </div>

              <div className="space-y-2">
                <Label>Bio</Label>
                <RHFTextarea name="bio" placeholder="Tell us about yourself" rows={4} />
              </div>

              <div className="space-y-2">
                <Label>Birth Date</Label>
                <RHFDateInput name="birthDate" />
              </div>

              <div className="space-y-2">
                <Label>Country</Label>
                <RHFSelect name="country" placeholder="Select your country" filterable>
                  <SelectOption value={null} label="Worldwide">
                    Worldwide
                  </SelectOption>
                  <SelectOption value="us" label="United State">
                    United States
                  </SelectOption>
                  <SelectOption value="uk" label="United Kingdom">
                    United Kingdom
                  </SelectOption>
                  <SelectOption value="ca" label="Canada">
                    Canada
                  </SelectOption>
                </RHFSelect>
              </div>

              <div className="space-y-3">
                <RHFCheckbox
                  name="agreeToTerms"
                  value={true}
                  uncheckedValue={false}
                  single
                  label="I agree to the terms and conditions"
                />
                <RHFError name="agreeToTerms" />
              </div>

              <div className="flex items-center gap-3">
                <RHFSwitch id="notifications" name="notifications" />
                <Label htmlFor="notifications">Enable email notifications</Label>
              </div>

              <div className="space-y-2">
                <Label>Preferred Contact Method</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <RHFRadio id="c1" name="contactMethod" value="email" />
                    <label htmlFor="c1">Email</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RHFRadio id="c2" name="contactMethod" value="phone" />
                    <label htmlFor="c2">Phone</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RHFRadio id="c3" name="contactMethod" value="sms" />
                    <label htmlFor="c3">SMS</label>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" variant="filled">
                  Submit Form
                </Button>
                <Button type="button" variant="outlined" onClick={() => toast.info("Form reset")}>
                  Reset
                </Button>
              </div>
            </form>
          </section>

          {/* Section 6: Feedback Components */}
          <section className="space-y-6  p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold border-b pb-2">Feedback Components</h2>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold ">Spinner</h3>
              <div className="flex gap-8 items-center">
                <Spinner />
                <Spinner className="stroke-red-500" />
                <Spinner stroke="green" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold ">Alerts</h3>
              <div className="space-y-3 max-w-2xl">
                <Alert variant="error" title="Error" description="Something went wrong!" />
                <Alert
                  variant="warning"
                  title="Warning"
                  description="Please proceed with caution"
                />
                <Alert
                  variant="info"
                  title="Information"
                  description="Here's some useful information"
                />
                <Alert
                  variant="success"
                  title="Success"
                  description="Operation completed successfully!"
                />
                {showAlert && (
                  <Alert
                    title="Simple Alert"
                    description="Simple text alert without variant styling"
                    onRemove={() => setShowAlert(false)}
                  />
                )}
                <Alert variant="error" title="Condensed" condensed />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold ">Toast Notifications</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="filled" onClick={() => toast.success("Success message!")}>
                  Success Toast
                </Button>
                <Button variant="filled" onClick={() => toast.error("Error message!")}>
                  Error Toast
                </Button>
                <Button variant="filled" onClick={() => toast.info("Info message!")}>
                  Info Toast
                </Button>
                <Button variant="filled" onClick={() => toast.warning("Warning message!")}>
                  Warning Toast
                </Button>
                <Button variant="filled" onClick={() => toast("Default message")}>
                  Default Toast
                </Button>
              </div>
            </div>
          </section>

          {/* Section 7: Overlay Components */}
          <section className="space-y-6  p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold border-b pb-2">Overlay Components</h2>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold ">Tooltip</h3>
              <div className="flex flex-wrap gap-4">
                <Tooltip content="Tooltip on top" placement="top">
                  <Button variant="outlined">Top</Button>
                </Tooltip>
                <Tooltip content="Tooltip on right" placement="right">
                  <Button variant="outlined">Right</Button>
                </Tooltip>
                <Tooltip content="Tooltip on bottom" placement="bottom">
                  <Button variant="outlined">Bottom</Button>
                </Tooltip>
                <Tooltip content="Tooltip on left" placement="left">
                  <Button variant="outlined">Left</Button>
                </Tooltip>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold ">Dialog</h3>
              <div className="flex gap-3">
                <Button
                  variant="filled"
                  onClick={() =>
                    Dialog.show({
                      content: ({ dismiss }) => (
                        <div className="space-y-4">
                          <h3 className="text-xl font-bold">Dialog Title</h3>
                          <p>This is a dialog component. You can put any content here.</p>
                          <div className="flex gap-3 justify-end">
                            <Button variant="outlined" onClick={dismiss}>
                              Cancel
                            </Button>
                            <Button
                              variant="filled"
                              onClick={() => {
                                toast.success("Confirmed!");
                                dismiss();
                              }}>
                              Confirm
                            </Button>
                          </div>
                        </div>
                      ),
                      className: "max-w-md"
                    })
                  }>
                  Open Dialog
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold ">Confirm Dialog</h3>
              <div className="flex gap-3">
                <Button
                  variant="filled"
                  onClick={() =>
                    ConfirmDialog.show({
                      title: "Confirm Action",
                      content: "Are you sure you want to proceed with this action?",
                      confirmButtonLabel: "Yes, Continue",
                      cancelButtonLabel: "Cancel",
                      onConfirm: async () => {
                        await new Promise((resolve) => setTimeout(resolve, 2000));
                        toast.success("Action confirmed!");
                      },
                      onCancel: () => {
                        toast.info("Action cancelled");
                      }
                    })
                  }>
                  Open Confirm Dialog
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold ">Drawer</h3>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="filled"
                  onClick={() => {
                    setDrawerPlacement("right");
                    setDrawerOpen(true);
                  }}>
                  Right Drawer
                </Button>
                <Button
                  variant="filled"
                  onClick={() => {
                    setDrawerPlacement("left");
                    setDrawerOpen(true);
                  }}>
                  Left Drawer
                </Button>
                <Button
                  variant="filled"
                  onClick={() => {
                    setDrawerPlacement("top");
                    setDrawerOpen(true);
                  }}>
                  Top Drawer
                </Button>
                <Button
                  variant="filled"
                  onClick={() => {
                    setDrawerPlacement("bottom");
                    setDrawerOpen(true);
                  }}>
                  Bottom Drawer
                </Button>

                <Drawer
                  open={drawerOpen}
                  handleClose={() => setDrawerOpen(false)}
                  placement={drawerPlacement}>
                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-bold">Drawer Content</h3>
                    <p>This is a {drawerPlacement} drawer. You can add any content here.</p>
                    <Button variant="filled" onClick={() => setDrawerOpen(false)}>
                      Close Drawer
                    </Button>
                  </div>
                </Drawer>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold ">Menu</h3>
              <div className="flex gap-3">
                <Menu label="Actions">
                  <MenuItem onClick={() => toast.info("Item 1")}>Item 1</MenuItem>
                  <MenuItem onClick={() => toast.info("Item 2")}>Item 2</MenuItem>
                  <MenuItem onClick={() => toast.info("Item 3")}>Item 3</MenuItem>
                </Menu>
              </div>
            </div>
          </section>

          {/* Section 8: Content Display Components */}
          <section className="space-y-6  p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold border-b pb-2">Content Display Components</h2>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pagination</h3>
              <div className="flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={10}
                  onChange={(page) => {
                    setCurrentPage(page);
                    toast.info(`Page ${page} selected`);
                  }}
                />
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="text-center pb-8">
            <p>All components from @geckoui/geckoui showcased above</p>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}

"use client";

import {
  Alert,
  Badge,
  Button,
  Calendar,
  Checkbox,
  ConfirmDialog,
  DateInput,
  DateRange,
  Dialog,
  Drawer,
  GeckoUIProvider,
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
  RHFInputGroup,
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
import { createContext, useContext, useLayoutEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const DemoUserContext = createContext<{ name: string } | null>(null);

const COUNTRIES = [
  ["mm", "Myanmar"],
  ["th", "Thailand"],
  ["sg", "Singapore"],
  ["vn", "Viet Nam"],
  ["my", "Malaysia"],
  ["id", "Indonesia"],
  ["ph", "Philippines"],
  ["kh", "Cambodia"],
  ["la", "Laos"],
  ["bn", "Brunei"],
  ["jp", "Japan"],
  ["kr", "South Korea"],
  ["cn", "China"],
  ["tw", "Taiwan"],
  ["hk", "Hong Kong"],
  ["in", "India"],
  ["bd", "Bangladesh"],
  ["lk", "Sri Lanka"],
  ["np", "Nepal"],
  ["pk", "Pakistan"],
  ["au", "Australia"],
  ["nz", "New Zealand"],
  ["us", "United States"],
  ["ca", "Canada"],
  ["mx", "Mexico"],
  ["br", "Brazil"],
  ["ar", "Argentina"],
  ["uk", "United Kingdom"],
  ["ie", "Ireland"],
  ["fr", "France"],
  ["de", "Germany"],
  ["es", "Spain"],
  ["it", "Italy"],
  ["pt", "Portugal"],
  ["nl", "Netherlands"],
  ["be", "Belgium"],
  ["ch", "Switzerland"],
  ["at", "Austria"],
  ["se", "Sweden"],
  ["no", "Norway"],
  ["dk", "Denmark"],
  ["fi", "Finland"],
  ["pl", "Poland"],
  ["cz", "Czechia"],
  ["gr", "Greece"],
  ["tr", "Turkey"],
  ["ae", "United Arab Emirates"],
  ["sa", "Saudi Arabia"],
  ["za", "South Africa"],
  ["ng", "Nigeria"],
  ["ke", "Kenya"],
  ["eg", "Egypt"]
] as const;

const FRAMEWORKS = [
  ["react", "React"],
  ["vue", "Vue"],
  ["svelte", "Svelte"],
  ["solid", "Solid"],
  ["qwik", "Qwik"],
  ["angular", "Angular"],
  ["preact", "Preact"],
  ["lit", "Lit"],
  ["alpine", "Alpine.js"],
  ["ember", "Ember"],
  ["astro", "Astro"],
  ["nuxt", "Nuxt"],
  ["next", "Next.js"],
  ["remix", "Remix"],
  ["sveltekit", "SvelteKit"],
  ["gatsby", "Gatsby"],
  ["redwood", "RedwoodJS"],
  ["htmx", "htmx"]
] as const;

const selectFormSchema = z.object({
  country: z.string({ message: "Pick a country" }).min(1, "Pick a country"),
  frameworks: z.array(z.string()).min(1, "Pick at least one framework"),
  plan: z.string().min(1, "Pick a plan")
});

function SelectFormDemo() {
  const methods = useForm({
    resolver: zodResolver(selectFormSchema) as never,
    mode: "onChange",
    defaultValues: { country: "", frameworks: [], plan: "" }
  });

  const onSubmit = (data: unknown) => {
    toast.success("Submitted", { description: JSON.stringify(data) });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="max-w-md space-y-4">
        <RHFInputGroup label="Country" required>
          <RHFSelect name="country" placeholder="Search a country" filterable>
            {COUNTRIES.map(([value, label]) => (
              <SelectOption key={value} value={value} label={label} />
            ))}
          </RHFSelect>
        </RHFInputGroup>

        <RHFInputGroup label="Frameworks" required>
          <RHFSelect name="frameworks" placeholder="Pick a few" multiple filterable="dropdown">
            {FRAMEWORKS.map(([value, label]) => (
              <SelectOption key={value} value={value} label={label} />
            ))}
          </RHFSelect>
        </RHFInputGroup>

        <RHFInputGroup label="Plan" required>
          <RHFSelect name="plan" placeholder="Select a plan">
            <SelectOption value="free" label="Free" />
            <SelectOption value="pro" label="Pro" />
            <SelectOption value="team" label="Team" />
          </RHFSelect>
        </RHFInputGroup>

        <div className="flex items-center gap-3">
          <Button type="submit" variant="filled">
            Submit
          </Button>
          <Button type="button" variant="outlined" onClick={() => methods.reset()}>
            Reset
          </Button>
          <span className="text-sm text-text-muted">
            {methods.formState.isValid ? "valid" : "fill the required fields"}
          </span>
        </div>
      </form>
    </FormProvider>
  );
}

function DialogWithSelect({ dismiss }: { dismiss: () => void }) {
  const [value, setValue] = useState<string>();

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Select Inside a Dialog</h3>
      <p className="text-sm text-gray-600">
        The Select menu renders in a portal outside the dialog element, so picking an option must
        not close the dialog. A long, filterable list also puts the menu over the dialog edge and
        over the backdrop.
      </p>
      <Select value={value} onChange={setValue} placeholder="Search a country" filterable>
        {COUNTRIES.map(([code, label]) => (
          <SelectOption key={code} value={code} label={label} />
        ))}
      </Select>
      <div className="flex gap-3 justify-end">
        <Button variant="outlined" onClick={dismiss}>
          Close
        </Button>
      </div>
    </div>
  );
}

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

  const [dialogOpen, setDialogOpen] = useState(false);
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
    <DemoUserContext.Provider value={{ name: "Alice" }}>
      <GeckoUIProvider>
        <FormProvider {...methods}>
          <div className="min-h-screen p-8">
            <div className="max-w-7xl mx-auto space-y-16">
              <div className="sticky top-0 z-[4000] -mx-8 -mt-8 mb-0 flex justify-end border-b border-border-primary bg-surface-primary/90 px-8 py-3 backdrop-blur">
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
                      <Checkbox id="check2" indeterminate />
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
                      {COUNTRIES.map(([value, label]) => (
                        <SelectOption key={value} value={value} label={label} />
                      ))}
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold ">Select in a form</h3>
                  <p className="text-sm text-text-muted">
                    Single, multiple and filterable selects inside react-hook-form with zod
                    validation. Submit with fields empty to see the errors.
                  </p>
                  <SelectFormDemo />
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
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => toast.info("Form reset")}>
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
                    <Alert color="error" title="Error" description="Something went wrong!" />
                    <Alert
                      color="warning"
                      title="Warning"
                      description="Please proceed with caution"
                    />
                    <Alert
                      color="info"
                      title="Information"
                      description="Here's some useful information"
                    />
                    <Alert
                      color="success"
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
                    <Alert color="error" title="Condensed" condensed />
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

                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outlined"
                      onClick={() =>
                        toast.success("Account created", {
                          description: "We sent a confirmation to you@company.com."
                        })
                      }>
                      With description
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() =>
                        toast.error("Upload failed", {
                          description: "The file was larger than 10MB.",
                          action: { label: "Retry", onClick: () => toast.success("Retrying") },
                          cancel: { label: "Cancel", onClick: () => undefined }
                        })
                      }>
                      With actions
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() =>
                        toast("Stays until dismissed", { duration: Infinity, closeButton: true })
                      }>
                      Persistent
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        const id = toast.loading("Uploading…");
                        setTimeout(() => toast.success("Uploaded", { id }), 2000);
                      }}>
                      Loading then success
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() =>
                        toast.promise(new Promise((resolve) => setTimeout(resolve, 1800)), {
                          loading: "Saving…",
                          success: "Saved",
                          error: "Could not save"
                        })
                      }>
                      Promise
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() =>
                        toast.custom(
                          <div className="rounded-xl bg-black px-4 py-3 text-white shadow-lg">
                            Fully custom node
                          </div>
                        )
                      }>
                      Custom
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {(
                      [
                        "top-left",
                        "top-center",
                        "top-right",
                        "bottom-left",
                        "bottom-center"
                      ] as const
                    ).map((pos) => (
                      <Button
                        key={pos}
                        variant="ghost"
                        size="sm"
                        onClick={() => toast(`Toast at ${pos}`, { position: pos })}>
                        {pos}
                      </Button>
                    ))}
                    <Button variant="ghost" size="sm" onClick={() => toast.dismiss()}>
                      Dismiss all
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
                  <h3 className="text-lg font-semibold ">Declarative Dialog</h3>
                  <p className="text-sm text-gray-600">
                    Dialog also works as a component, the same way Drawer does.
                  </p>
                  <div className="flex gap-3">
                    <Button variant="filled" onClick={() => setDialogOpen(true)}>
                      Open Declarative Dialog
                    </Button>
                    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold">Declarative Dialog</h3>
                        <p>
                          The parent owns the open state. Esc and a backdrop click call onClose.
                        </p>
                        <div className="flex gap-3 justify-end">
                          <Button variant="filled" onClick={() => setDialogOpen(false)}>
                            Close
                          </Button>
                        </div>
                      </div>
                    </Dialog>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold ">Select Inside a Dialog</h3>
                  <p className="text-sm text-gray-600">
                    Clicking content inside the dialog never dismisses it, including menus rendered
                    in a portal.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="filled"
                      onClick={() =>
                        Dialog.show({
                          content: ({ dismiss }) => <DialogWithSelect dismiss={dismiss} />,
                          className: "max-w-md"
                        })
                      }>
                      Open Dialog With Select
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold ">Stacked Dialogs</h3>
                  <div className="flex gap-3">
                    <Button
                      variant="filled"
                      onClick={() =>
                        Dialog.show({
                          content: ({ dismiss }) => (
                            <div className="space-y-4">
                              <h3 className="text-xl font-bold">First Dialog</h3>
                              <p>This dialog is on the bottom of the stack.</p>
                              <Button
                                variant="outlined"
                                onClick={() =>
                                  Dialog.show({
                                    content: ({ dismiss: dismissInner }) => (
                                      <div className="space-y-4">
                                        <h3 className="text-xl font-bold">Second Dialog</h3>
                                        <p>
                                          This dialog is stacked on top. Esc closes this one first.
                                        </p>
                                        <div className="flex gap-3 justify-end">
                                          <Button variant="outlined" onClick={dismissInner}>
                                            Close This
                                          </Button>
                                        </div>
                                      </div>
                                    ),
                                    className: "max-w-sm"
                                  })
                                }>
                                Open Another on Top
                              </Button>
                              <div className="flex gap-3 justify-end">
                                <Button variant="outlined" onClick={dismiss}>
                                  Close This
                                </Button>
                              </div>
                            </div>
                          ),
                          className: "max-w-md"
                        })
                      }>
                      Open Stacked Dialogs
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold ">Dialog Over Drawer</h3>
                  <p className="text-sm text-gray-600">
                    Dialogs always render above drawers, whichever one opened last. Esc closes the
                    dialog first.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="filled"
                      onClick={() =>
                        Drawer.show(
                          <div className="p-6 space-y-4">
                            <h3 className="text-xl font-bold">Drawer</h3>
                            <p>Open a dialog from here and watch where it lands.</p>
                            <div className="flex flex-col gap-3">
                              <Button
                                variant="filled"
                                onClick={() =>
                                  Dialog.show({
                                    content: ({ dismiss }) => (
                                      <div className="space-y-4">
                                        <h3 className="text-xl font-bold">Dialog Above Drawer</h3>
                                        <p>This dialog sits on top of the drawer behind it.</p>
                                        <div className="flex gap-3 justify-end">
                                          <Button variant="outlined" onClick={dismiss}>
                                            Close Dialog
                                          </Button>
                                        </div>
                                      </div>
                                    ),
                                    className: "max-w-sm"
                                  })
                                }>
                                Open a Dialog on Top
                              </Button>
                              <Button variant="outlined" onClick={() => Drawer.dismiss()}>
                                Close Drawer
                              </Button>
                            </div>
                          </div>,
                          { placement: "right" }
                        )
                      }>
                      Open Drawer Then Dialog
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold ">Context in Dialog</h3>
                  <p className="text-sm text-gray-600">
                    Dialog content can read React context provided above GeckoUIProvider.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="filled"
                      onClick={() =>
                        Dialog.show({
                          content: ({ dismiss }) => {
                            const user = useContext(DemoUserContext);
                            return (
                              <div className="space-y-4">
                                <h3 className="text-xl font-bold">Context Works!</h3>
                                <p>
                                  Hello, <strong>{user?.name ?? "unknown"}</strong>! This value came
                                  from DemoUserContext provided above GeckoUIProvider.
                                </p>
                                <Button onClick={dismiss}>Close</Button>
                              </div>
                            );
                          },
                          className: "max-w-sm"
                        })
                      }>
                      Open Context-Aware Dialog
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
                      onClose={() => setDrawerOpen(false)}
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
                  <h3 className="text-lg font-semibold ">Imperative Drawer</h3>
                  <p className="text-sm text-gray-600">
                    Drawer.show() returns an id. onClose still runs when the drawer is dismissed by
                    id.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="filled"
                      onClick={() => {
                        const id = Drawer.show(
                          <div className="p-6 space-y-4">
                            <h3 className="text-xl font-bold">Imperative Drawer</h3>
                            <p>Backdrop click is blocked here because allowClickOutside is off.</p>
                            <Button variant="filled" onClick={() => Drawer.dismiss(id)}>
                              Close by Id
                            </Button>
                          </div>,
                          {
                            placement: "left",
                            onClose: () => toast.info("onClose ran")
                          }
                        );
                      }}>
                      Open Imperative Drawer
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() =>
                        Drawer.show(
                          <div className="p-6 space-y-4">
                            <h3 className="text-xl font-bold">Click Through Drawer</h3>
                            <p>allowClickOutside is on, so clicking anywhere outside closes it.</p>
                          </div>,
                          { placement: "bottom", allowClickOutside: true }
                        )
                      }>
                      Open Click Through Drawer
                    </Button>
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
                  <h3 className="text-lg font-semibold">Badge</h3>

                  <p className="text-sm text-text-muted">Variants x colors</p>
                  {(["filled", "soft", "outlined"] as const).map((variant) => (
                    <div key={variant} className="flex flex-wrap items-center gap-2">
                      {(["default", "primary", "success", "error", "warning", "info"] as const).map(
                        (color) => (
                          <Badge key={color} variant={variant} color={color}>
                            {variant}/{color}
                          </Badge>
                        )
                      )}
                    </div>
                  ))}

                  <p className="text-sm text-text-muted">Sizes</p>
                  <div className="flex flex-wrap items-center gap-2">
                    {(["sm", "md", "lg"] as const).map((size) => (
                      <Badge key={size} size={size} color="primary">
                        Size {size}
                      </Badge>
                    ))}
                  </div>

                  <p className="text-sm text-text-muted">Shapes</p>
                  <div className="flex flex-wrap items-center gap-2">
                    {(["rounded", "pill", "square"] as const).map((shape) => (
                      <Badge key={shape} shape={shape} color="info" variant="outlined">
                        {shape}
                      </Badge>
                    ))}
                  </div>

                  <p className="text-sm text-text-muted">Dot and custom icon</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge color="success" dot>
                      Live
                    </Badge>
                    <Badge color="warning" dot>
                      Degraded
                    </Badge>
                    <Badge color="error" dot variant="filled">
                      Down
                    </Badge>
                    <Badge
                      color="warning"
                      shape="pill"
                      icon={
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                          <path d="M6 0l1.8 3.9 4.2.5-3.1 2.9.8 4.2L6 9.5 2.3 11.5l.8-4.2L0 4.4l4.2-.5L6 0z" />
                        </svg>
                      }>
                      Featured
                    </Badge>
                    <Badge color="primary" variant="filled">
                      Plain children <strong>work too</strong>
                    </Badge>
                  </div>
                </div>

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
      </GeckoUIProvider>
    </DemoUserContext.Provider>
  );
}

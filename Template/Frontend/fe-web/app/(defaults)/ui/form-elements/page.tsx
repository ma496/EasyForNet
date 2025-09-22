"use client"

import React, { useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

// Form components
import { FormInput } from '@/components/ui/form-input'
import { FormTextarea } from '@/components/ui/form-textarea'
import { FormPasswordInput } from '@/components/ui/form-password-input'
import { FormSelect } from '@/components/ui/form-select'
import { FormMultiSelect } from '@/components/ui/form-multi-select'
import { FormCheckbox } from '@/components/ui/form-checkbox'
import { FormRadio } from '@/components/ui/form-radio'
import { FormDatePicker } from '@/components/ui/form-date-picker'

// General components
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PasswordInput } from '@/components/ui/password-input'
import { Select } from '@/components/ui/select'
import { MultiSelect } from '@/components/ui/multi-select'
import { Checkbox } from '@/components/ui/checkbox'
import { Radio } from '@/components/ui/radio'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import CodeShowcase from '@/components/ui/code-showcase'
import {
  FormInput as FormInputIcon,
  Type,
  Lock,
  ChevronDown,
  List,
  CheckSquare,
  Circle,
  Calendar,
  User,
  Mail,
  MapPin,
  Tag,
  Briefcase
} from 'lucide-react'

const validationSchema = Yup.object({
  username: Yup.string().required('Username is required').min(3, 'Min 3 characters'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required').min(8, 'Min 8 characters'),
  bio: Yup.string().max(500, 'Max 500 characters'),
  country: Yup.string().required('Country is required'),
  skills: Yup.array().min(1, 'Select at least one skill'),
  newsletter: Yup.boolean(),
  gender: Yup.string().required('Gender is required'),
  birthDate: Yup.date().required('Birth date is required').max(new Date(), 'Cannot be future date'),
  projectType: Yup.string().required('Project type is required')
})

const FormElementsDemo = () => {
  // General component states
  const [generalInput, setGeneralInput] = useState("")
  const [generalTextarea, setGeneralTextarea] = useState("")
  const [generalPassword, setGeneralPassword] = useState("")
  const [generalSelect, setGeneralSelect] = useState("")
  const [generalMultiSelect, setGeneralMultiSelect] = useState<string[]>([])
  const [generalCheckbox, setGeneralCheckbox] = useState(false)
  const [generalRadio, setGeneralRadio] = useState("")

  // Demo select states
  const [basicSelect, setBasicSelect] = useState("")
  const [iconSearchSelect, setIconSearchSelect] = useState("")
  const [largeSelect, setLargeSelect] = useState("")
  const [multiSelectDemo, setMultiSelectDemo] = useState<string[]>([])

  // Sample data
  const countries = [
    { label: "United States", value: "us" },
    { label: "Canada", value: "ca" },
    { label: "United Kingdom", value: "uk" },
    { label: "Germany", value: "de" },
    { label: "France", value: "fr" },
    { label: "Japan", value: "jp" },
    { label: "Australia", value: "au" }
  ]

  const skills = [
    { label: "JavaScript", value: "javascript" },
    { label: "TypeScript", value: "typescript" },
    { label: "React", value: "react" },
    { label: "Vue.js", value: "vue" },
    { label: "Angular", value: "angular" },
    { label: "Node.js", value: "nodejs" },
    { label: "Python", value: "python" },
    { label: "Java", value: "java" }
  ]

  const projectTypes = [
    { label: "Web Application", value: "web" },
    { label: "Mobile App", value: "mobile" },
    { label: "Desktop Software", value: "desktop" },
    { label: "API/Backend", value: "api" }
  ]

  const codeExamples = {
    formComponents: `// Form Components (with Formik integration)
import { FormInput, FormTextarea, FormPasswordInput } from '@/components/ui/form-*'
import { FormSelect, FormMultiSelect } from '@/components/ui/form-*'
import { FormCheckbox, FormRadio, FormDatePicker } from '@/components/ui/form-*'
import { Formik, Form } from 'formik'

<Formik
  initialValues={{
    username: '',
    email: '',
    password: '',
    bio: '',
    country: '',
    skills: [],
    newsletter: false,
    gender: '',
    birthDate: undefined
  }}
  validationSchema={validationSchema}
  onSubmit={handleSubmit}
>
  <Form>
    <FormInput name="username" label="Username" placeholder="Enter username" />
    <FormTextarea name="bio" label="Biography" rows={4} />
    <FormPasswordInput name="password" label="Password" />
    <FormSelect name="country" label="Country" options={countries} />
    <FormMultiSelect name="skills" label="Skills" options={skills} />
    <FormCheckbox name="newsletter" label="Subscribe to newsletter" />
    <FormRadio name="gender" value="male" label="Male" />
    <FormDatePicker name="birthDate" label="Birth Date" />
  </Form>
</Formik>`,

    generalComponents: `// General Components (standalone, no Formik)
import { Input, Textarea, PasswordInput } from '@/components/ui/*'
import { Select, MultiSelect } from '@/components/ui/*'
import { Checkbox, Radio } from '@/components/ui/*'

const [value, setValue] = useState("")
const [multiValue, setMultiValue] = useState([])

<Input
  value={value}
  onChange={(e) => setValue(e.target.value)}
  label="Username"
  placeholder="Enter username"
/>
<Textarea
  value={value}
  onChange={(e) => setValue(e.target.value)}
  label="Description"
/>
<Select
  value={value}
  onChange={setValue}
  options={options}
  label="Country"
/>
<MultiSelect
  value={multiValue}
  onChange={setMultiValue}
  options={options}
  label="Skills"
/>
<Checkbox
  checked={checked}
  onChange={(e) => setChecked(e.target.checked)}
  label="Accept terms"
/>`,

    inputVariants: `// Input variations
<Input
  label="Basic Input"
  placeholder="Type something..."
/>

<Input
  label="With Icon"
  placeholder="Email address..."
  icon={<Mail className="h-4 w-4" />}
/>

<Input
  label="With Error"
  placeholder="Username..."
  error="Username is required"
/>

<Input
  disabled
  label="Disabled Input"
  placeholder="Cannot edit..."
/>`,

    selectVariants: `// Select variations
<Select
  label="Basic Select"
  options={options}
  placeholder="Choose option..."
/>

<Select
  label="With Icon & Search"
  options={options}
  icon={<MapPin className="h-4 w-4" />}
  searchable={true}
/>

<Select
  label="Different Sizes"
  options={options}
  size="lg"
  clearable={false}
/>`
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <FormInputIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-black dark:text-white">Form Elements Components</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          Comprehensive collection of form components including both standalone and Formik-integrated versions
          with validation, styling options, and accessibility features.
        </p>
      </div>

      {/* Complete Formik Form */}
      <CodeShowcase
        title="Complete Formik Form Integration"
        description="Full form with all form components, validation, and state management"
        code={codeExamples.formComponents}
        preview={(
          <div className="w-full">
            <Formik
              initialValues={{
                username: "",
                email: "",
                password: "",
                bio: "",
                country: "",
                skills: [],
                newsletter: false,
                gender: "",
                birthDate: undefined,
                projectType: ""
              }}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                alert(`Form submitted successfully!\n\nValues:\n${JSON.stringify(values, null, 2)}`)
                setSubmitting(false)
              }}
            >
              {({ isSubmitting, values }) => (
                <Form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      name="username"
                      label="Username *"
                      placeholder="Enter your username"
                      icon={<User className="h-4 w-4" />}
                    />

                    <FormInput
                      name="email"
                      type="email"
                      label="Email Address *"
                      placeholder="Enter your email"
                      icon={<Mail className="h-4 w-4" />}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormPasswordInput
                      name="password"
                      label="Password *"
                      placeholder="Enter your password"
                      icon={<Lock className="h-4 w-4" />}
                    />

                    <FormSelect
                      name="country"
                      label="Country *"
                      options={countries}
                      placeholder="Select your country"
                      icon={<MapPin className="h-4 w-4" />}
                    />
                  </div>

                  <FormTextarea
                    name="bio"
                    label="Biography"
                    placeholder="Tell us about yourself (optional)"
                    rows={4}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormMultiSelect
                      name="skills"
                      label="Skills *"
                      options={skills}
                      placeholder="Select your skills"
                      icon={<Tag className="h-4 w-4" />}
                    />

                    <FormSelect
                      name="projectType"
                      label="Project Type *"
                      options={projectTypes}
                      placeholder="Select project type"
                      icon={<Briefcase className="h-4 w-4" />}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormDatePicker
                      name="birthDate"
                      label="Birth Date *"
                      placeholder="Select your birth date"
                    />

                    <div className="space-y-4">
                      <label className="label form-label">Gender *</label>
                      <div className="flex gap-6">
                        <FormRadio
                          name="gender"
                          value="male"
                          label="Male"
                        />
                        <FormRadio
                          name="gender"
                          value="female"
                          label="Female"
                        />
                        <FormRadio
                          name="gender"
                          value="other"
                          label="Other"
                        />
                      </div>
                    </div>
                  </div>

                  <FormCheckbox
                    name="newsletter"
                    label="Subscribe to newsletter and updates"
                  />

                  <div className="flex gap-4 pt-4">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit Form'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const valuesText = JSON.stringify(values, null, 2)
                        alert(`Current values:\n\n${valuesText}`)
                      }}
                    >
                      Log Values
                    </Button>
                  </div>

                  {/* Current Values Display */}
                  <Card className="p-4 bg-gray-50 dark:bg-gray-900">
                    <h4 className="font-medium mb-2">Current Form Values:</h4>
                    <pre className="text-sm text-gray-600 dark:text-gray-300 overflow-auto">
                      {JSON.stringify(values, null, 2)}
                    </pre>
                  </Card>
                </Form>
              )}
            </Formik>
          </div>
        )}
      />

      {/* General Components Demo */}
      <CodeShowcase
        title="General Components (Standalone)"
        description="Standalone components without Formik integration for custom use cases"
        code={codeExamples.generalComponents}
        preview={(
          <div className="space-y-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Username"
                placeholder="Enter username"
                value={generalInput}
                onChange={(e) => setGeneralInput(e.target.value)}
                icon={<User className="h-4 w-4" />}
              />

              <PasswordInput
                label="Password"
                placeholder="Enter password"
                value={generalPassword}
                onChange={(e) => setGeneralPassword(e.target.value)}
                icon={<Lock className="h-4 w-4" />}
              />
            </div>

            <Textarea
              label="Description"
              placeholder="Enter description"
              value={generalTextarea}
              onChange={(e) => setGeneralTextarea(e.target.value)}
              rows={3}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                name="country"
                label="Country"
                options={countries}
                value={generalSelect}
                onChange={(name, value) => setGeneralSelect(value)}
                placeholder="Select country"
                icon={<MapPin className="h-4 w-4" />}
              />

              <MultiSelect
                label="Skills"
                options={skills}
                value={generalMultiSelect}
                onChange={setGeneralMultiSelect}
                placeholder="Select skills"
                icon={<Tag className="h-4 w-4" />}
              />
            </div>

            <div className="flex gap-8">
              <Checkbox
                label="Accept terms and conditions"
                checked={generalCheckbox}
                onChange={(e) => setGeneralCheckbox(e.target.checked)}
              />

              <div className="flex gap-4">
                <Radio
                  name="demo-radio"
                  value="option1"
                  label="Option 1"
                  checked={generalRadio === "option1"}
                  onChange={(e) => setGeneralRadio(e.target.value)}
                />
                <Radio
                  name="demo-radio"
                  value="option2"
                  label="Option 2"
                  checked={generalRadio === "option2"}
                  onChange={(e) => setGeneralRadio(e.target.value)}
                />
              </div>
            </div>

            <Card className="p-4 bg-gray-50 dark:bg-gray-900">
              <h4 className="font-medium mb-2">Current Component States:</h4>
              <pre className="text-sm text-gray-600 dark:text-gray-300">
                {JSON.stringify({
                  input: generalInput,
                  textarea: generalTextarea,
                  password: generalPassword ? '***hidden***' : '',
                  select: generalSelect,
                  multiSelect: generalMultiSelect,
                  checkbox: generalCheckbox,
                  radio: generalRadio
                }, null, 2)}
              </pre>
            </Card>
          </div>
        )}
      />

      {/* Component Variants */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CodeShowcase
          title="Input Variants"
          description="Different input configurations and states"
          code={codeExamples.inputVariants}
          preview={(
            <div className="space-y-4">
              <Input
                label="Basic Input"
                placeholder="Type something..."
              />

              <Input
                label="With Icon"
                placeholder="Email address..."
                icon={<Mail className="h-4 w-4" />}
              />

              <Input
                label="With Error"
                placeholder="Username..."
                error="Username is required"
                defaultValue="invalid"
              />

              <Input
                disabled
                label="Disabled Input"
                placeholder="Cannot edit..."
                defaultValue="Read only"
              />
            </div>
          )}
        />

        <CodeShowcase
          title="Select Variants"
          description="Different select configurations"
          code={codeExamples.selectVariants}
          preview={(
            <div className="space-y-4">
              <Select
                name="basic-select"
                label="Basic Select"
                options={countries.slice(0, 4)}
                value={basicSelect}
                onChange={(name, value) => setBasicSelect(value)}
                placeholder="Choose option..."
              />

              <Select
                name="icon-search-select"
                label="With Icon & Search"
                options={countries}
                value={iconSearchSelect}
                onChange={(name, value) => setIconSearchSelect(value)}
                icon={<MapPin className="h-4 w-4" />}
                searchable={true}
                placeholder="Search countries..."
              />

              <Select
                name="large-select"
                label="Large Size, No Clear"
                options={countries.slice(0, 3)}
                value={largeSelect}
                onChange={(name, value) => setLargeSelect(value)}
                size="lg"
                clearable={false}
                placeholder="Select country..."
              />

              <MultiSelect
                label="Multi-Select"
                options={skills.slice(0, 5)}
                value={multiSelectDemo}
                onChange={setMultiSelectDemo}
                placeholder="Select multiple..."
              />
            </div>
          )}
        />
      </div>

      {/* Component Props Documentation */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Components Overview</h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium mb-4">Form Components (Formik Integration)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <h4 className="font-medium mb-2">FormInput</h4>
                <p className="text-gray-600 dark:text-gray-300">Text input with validation</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <h4 className="font-medium mb-2">FormTextarea</h4>
                <p className="text-gray-600 dark:text-gray-300">Multi-line text input</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <h4 className="font-medium mb-2">FormPasswordInput</h4>
                <p className="text-gray-600 dark:text-gray-300">Password with toggle visibility</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <h4 className="font-medium mb-2">FormSelect</h4>
                <p className="text-gray-600 dark:text-gray-300">Single-select dropdown</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <h4 className="font-medium mb-2">FormMultiSelect</h4>
                <p className="text-gray-600 dark:text-gray-300">Multi-select dropdown</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <h4 className="font-medium mb-2">FormCheckbox</h4>
                <p className="text-gray-600 dark:text-gray-300">Checkbox with variants</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <h4 className="font-medium mb-2">FormRadio</h4>
                <p className="text-gray-600 dark:text-gray-300">Radio button selection</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <h4 className="font-medium mb-2">FormDatePicker</h4>
                <p className="text-gray-600 dark:text-gray-300">Date selection component</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">General Components (Standalone)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <h4 className="font-medium mb-2">Input</h4>
                <p className="text-gray-600 dark:text-gray-300">Basic text input</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <h4 className="font-medium mb-2">Textarea</h4>
                <p className="text-gray-600 dark:text-gray-300">Multi-line text input</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <h4 className="font-medium mb-2">PasswordInput</h4>
                <p className="text-gray-600 dark:text-gray-300">Password input</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <h4 className="font-medium mb-2">Select</h4>
                <p className="text-gray-600 dark:text-gray-300">Single-select dropdown</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <h4 className="font-medium mb-2">MultiSelect</h4>
                <p className="text-gray-600 dark:text-gray-300">Multi-select dropdown</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <h4 className="font-medium mb-2">Checkbox</h4>
                <p className="text-gray-600 dark:text-gray-300">Checkbox input</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <h4 className="font-medium mb-2">Radio</h4>
                <p className="text-gray-600 dark:text-gray-300">Radio button</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <ul className="space-y-2">
                <li>✅ <strong>Formik Integration:</strong> Seamless form state management</li>
                <li>✅ <strong>Validation Support:</strong> Built-in error handling and display</li>
                <li>✅ <strong>Accessibility:</strong> ARIA compliant with proper focus management</li>
                <li>✅ <strong>Dark Mode:</strong> Full support for light and dark themes</li>
              </ul>
              <ul className="space-y-2">
                <li>✅ <strong>Customizable:</strong> Multiple size variants and styling options</li>
                <li>✅ <strong>Icons Support:</strong> Easy icon integration</li>
                <li>✅ <strong>Search:</strong> Built-in search for select components</li>
                <li>✅ <strong>TypeScript:</strong> Full type safety and IntelliSense</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default FormElementsDemo;

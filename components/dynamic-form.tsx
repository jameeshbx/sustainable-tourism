"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ImageField } from "@/components/image-field";
import { LocationField } from "@/components/location-field";

interface FormField {
  id: string;
  name: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  options?: string;
  order: number;
  width?: "half" | "full";
}

interface DynamicFormProps {
  fields: FormField[];
  values?: Record<string, string>;
  onChange?: (name: string, value: string) => void;
  errors?: Record<string, string>;
}

export function DynamicForm({
  fields,
  values = {},
  onChange,
  errors = {},
}: DynamicFormProps) {
  const sortedFields = [...fields].sort((a, b) => a.order - b.order);

  const handleChange = (name: string, value: string) => {
    if (onChange) {
      onChange(name, value);
    }
  };

  const renderField = (field: FormField) => {
    const value = values[field.name] || "";
    const error = errors[field.name];

    switch (field.type) {
      case "text":
        return (
          <div key={field.id}>
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.name}
              name={field.name}
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );

      case "textarea":
        return (
          <div key={field.id}>
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={field.name}
              name={field.name}
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );

      case "number":
        return (
          <div key={field.id}>
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.name}
              name={field.name}
              type="number"
              value={value}
              onChange={(e) =>
                handleChange(
                  field.name,
                  String(parseFloat(e.target.value) || 0)
                )
              }
              placeholder={field.placeholder}
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );

      case "date":
        return (
          <div key={field.id}>
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.name}
              name={field.name}
              type="date"
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );

      case "time":
        return (
          <div key={field.id}>
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.name}
              name={field.name}
              type="time"
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );

      case "dateTime":
        return (
          <div key={field.id}>
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.name}
              name={field.name}
              type="datetime-local"
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );

      case "location":
        return (
          <div key={field.id}>
            <LocationField
              name={field.name}
              label={field.label}
              required={field.required}
              placeholder={field.placeholder}
              value={value}
              onChange={handleChange}
              error={error}
            />
          </div>
        );

      case "select":
        const selectOptions = field.options
          ? field.options.split("\n").filter((opt) => opt.trim())
          : [];
        return (
          <div key={field.id}>
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={value}
              onValueChange={(val) => handleChange(field.name, val)}
            >
              <SelectTrigger className={error ? "border-red-500" : ""}>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {selectOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );

      case "radio":
        const radioOptions = field.options
          ? field.options.split("\n").filter((opt) => opt.trim())
          : [];
        return (
          <div key={field.id}>
            <Label>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <RadioGroup
              value={value}
              onValueChange={(val) => handleChange(field.name, val)}
              className="mt-2"
            >
              {radioOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option}
                    id={`${field.name}-${option}`}
                  />
                  <Label htmlFor={`${field.name}-${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );

      case "image":
        return (
          <div key={field.id}>
            <ImageField
              name={field.name}
              label={field.label}
              required={field.required}
              placeholder={field.placeholder}
              value={value}
              onChange={(name, val) => handleChange(name, String(val || ""))}
              error={error}
            />
          </div>
        );

      case "checkbox":
        return (
          <div key={field.id} className="flex items-center space-x-2">
            <Checkbox
              id={field.name}
              name={field.name}
              checked={value === "true"}
              onCheckedChange={(checked) =>
                handleChange(field.name, String(checked))
              }
            />
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );

      default:
        return (
          <div key={field.id}>
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              name={field.name}
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
            />
          </div>
        );
    }
  };

  const renderFieldsWithHalfWidthSupport = () => {
    const elements: React.ReactElement[] = [];
    let i = 0;

    while (i < sortedFields.length) {
      const currentField = sortedFields[i];
      const nextField = sortedFields[i + 1];

      // Check if current and next fields are both half-width
      if (currentField.width === "half" && nextField?.width === "half") {
        // Render both fields in a row
        elements.push(
          <div
            key={`row-${i}`}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>{renderField(currentField)}</div>
            <div>{renderField(nextField)}</div>
          </div>
        );
        i += 2; // Skip both fields
      } else {
        // Render single field
        elements.push(
          <div key={currentField.id} className="w-full">
            {renderField(currentField)}
          </div>
        );
        i += 1;
      }
    }

    return elements;
  };

  return <div className="space-y-4">{renderFieldsWithHalfWidthSupport()}</div>;
}

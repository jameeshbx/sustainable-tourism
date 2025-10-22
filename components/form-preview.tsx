"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FormField {
  id?: string;
  name: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  options?: string;
  order: number;
  width?: "half" | "full";
}

interface FormPreviewProps {
  fields: FormField[];
  categoryName: string;
}

export function FormPreview({ fields, categoryName }: FormPreviewProps) {
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _handleFieldChange = (name: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sortedFields = [...fields].sort((a, b) => a.order - b.order);

  const renderFieldsWithHalfWidthSupport = (fields: FormField[]) => {
    const elements: React.ReactElement[] = [];
    let i = 0;

    while (i < fields.length) {
      const currentField = fields[i];
      const nextField = fields[i + 1];

      // Check if current and next fields are both half-width
      if (currentField.width === "half" && nextField?.width === "half") {
        // Render both fields in a row
        elements.push(
          <div
            key={`row-${i}`}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="text-sm font-medium text-gray-700">
                {currentField.label}
                {currentField.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
              <div className="mt-1">
                {renderPreviewField(
                  currentField,
                  formValues[currentField.name] || ""
                )}
              </div>
              {currentField.placeholder && (
                <p className="text-xs text-gray-500 mt-1">
                  Placeholder: &quot;{currentField.placeholder}&quot;
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                {nextField.label}
                {nextField.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
              <div className="mt-1">
                {renderPreviewField(
                  nextField,
                  formValues[nextField.name] || ""
                )}
              </div>
              {nextField.placeholder && (
                <p className="text-xs text-gray-500 mt-1">
                  Placeholder: &quot;{nextField.placeholder}&quot;
                </p>
              )}
            </div>
          </div>
        );
        i += 2; // Skip both fields
      } else {
        // Render single field
        elements.push(
          <div key={currentField.id || i} className="w-full">
            <label className="text-sm font-medium text-gray-700">
              {currentField.label}
              {currentField.required && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </label>
            <div className="mt-1">
              {renderPreviewField(
                currentField,
                formValues[currentField.name] || ""
              )}
            </div>
            {currentField.placeholder && (
              <p className="text-xs text-gray-500 mt-1">
                Placeholder: &quot;{currentField.placeholder}&quot;
              </p>
            )}
          </div>
        );
        i += 1;
      }
    }

    return elements;
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Form Preview</span>
          <Badge variant="outline" className="text-xs">
            Live Preview
          </Badge>
        </CardTitle>
        <p className="text-sm text-gray-600">
          This is how your form will look to users when creating destinations in
          the <strong>{categoryName}</strong> category.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Category Selection Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Category *
              </label>
              <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white text-sm text-gray-500">
                {categoryName} (Selected)
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Subcategory *
              </label>
              <div className="mt-1 p-2 border border-gray-300 rounded-md bg-white text-sm text-gray-500">
                Select a subcategory
              </div>
            </div>
          </div>

          {/* Dynamic Fields Preview */}
          {sortedFields.length > 0 ? (
            <div className="space-y-4">
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Destination Information for {categoryName}
                </h4>
                <div className="space-y-4">
                  {renderFieldsWithHalfWidthSupport(sortedFields)}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No form fields configured yet.</p>
              <p className="text-xs mt-1">
                Add fields on the left to see the preview here.
              </p>
            </div>
          )}

          {/* Form Actions Preview */}
          <div className="border-t pt-4">
            <div className="flex space-x-4">
              <div className="flex-1 p-3 bg-blue-600 text-white text-center rounded-md text-sm font-medium">
                Create Destination
              </div>
              <div className="flex-1 p-3 border border-gray-300 text-center rounded-md text-sm font-medium">
                Cancel
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function renderPreviewField(field: FormField, value: unknown) {
  const baseClasses = "w-full p-2 border border-gray-300 rounded-md text-sm";

  switch (field.type) {
    case "text":
      return (
        <input
          type="text"
          className={baseClasses}
          placeholder={field.placeholder}
          value={String(value || "")}
          disabled
        />
      );

    case "textarea":
      return (
        <textarea
          className={`${baseClasses} h-20 resize-none`}
          placeholder={field.placeholder}
          value={String(value || "")}
          disabled
        />
      );

    case "number":
      return (
        <input
          type="number"
          className={baseClasses}
          placeholder={field.placeholder}
          value={String(value || "")}
          disabled
        />
      );

    case "date":
      return (
        <input
          type="date"
          className={baseClasses}
          value={String(value || "")}
          disabled
        />
      );

    case "time":
      return (
        <input
          type="time"
          className={baseClasses}
          value={String(value || "")}
          disabled
        />
      );

    case "dateTime":
      return (
        <input
          type="datetime-local"
          className={baseClasses}
          value={String(value || "")}
          disabled
        />
      );

    case "location":
      return (
        <div className="relative">
          <div className="flex items-center space-x-2">
            <div className="flex-1 p-2 border border-gray-300 rounded-md text-sm text-gray-500">
              {field.placeholder || "Search for a location..."}
            </div>
            <button
              type="button"
              className="p-2 border border-gray-300 rounded-md text-sm"
              disabled
            >
              📍
            </button>
          </div>
        </div>
      );

    case "select":
      const selectOptions = field.options
        ? field.options.split("\n").filter((opt) => opt.trim())
        : [];
      return (
        <select className={baseClasses} disabled>
          <option value="">{field.placeholder || "Select an option"}</option>
          {selectOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      );

    case "radio":
      const radioOptions = field.options
        ? field.options.split("\n").filter((opt) => opt.trim())
        : [];
      return (
        <div className="space-y-2">
          {radioOptions.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="radio"
                name={field.name}
                className="text-blue-600"
                disabled
              />
              <label className="text-sm text-gray-700">{option}</label>
            </div>
          ))}
        </div>
      );

    case "checkbox":
      return (
        <div className="flex items-center space-x-2">
          <input type="checkbox" className="text-blue-600" disabled />
          <label className="text-sm text-gray-700">{field.label}</label>
        </div>
      );

    case "image":
      return (
        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
          <div className="text-sm text-gray-500">
            {field.placeholder || "Click to upload image"}
          </div>
        </div>
      );

    default:
      return (
        <input
          type="text"
          className={baseClasses}
          placeholder={field.placeholder}
          value={String(value || "")}
          disabled
        />
      );
  }
}

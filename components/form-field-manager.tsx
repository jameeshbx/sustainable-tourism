"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToastActions } from "@/lib/toast-actions";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, GripVertical } from "lucide-react";

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

interface FormFieldManagerProps {
  categoryId: string;
  initialFields?: FormField[];
  onSave: (fields: FormField[]) => Promise<void>;
  onFieldsChange?: (fields: FormField[]) => void;
}

const FIELD_TYPES = [
  { value: "text", label: "Text Input" },
  { value: "textarea", label: "Text Area" },
  { value: "number", label: "Number" },
  { value: "price", label: "Price" },
  { value: "date", label: "Date" },
  { value: "time", label: "Time" },
  { value: "dateTime", label: "Date & Time" },
  { value: "location", label: "Location (Mapbox)" },
  { value: "route", label: "Route (Mapbox - Single/Multiple Points)" },
  { value: "image", label: "Image Upload" },
  { value: "select", label: "Select Dropdown" },
  { value: "radio", label: "Radio Buttons" },
  { value: "checkbox", label: "Checkbox" },
];

// Parse price field options from JSON string
const parsePriceOptions = (options?: string) => {
  if (!options) {
    return {
      currencySymbol: "$",
      pricingModel: "per_person" as "per_person" | "per_group",
      groupSize: 1,
    };
  }
  try {
    const parsed = JSON.parse(options);
    return {
      currencySymbol: parsed.currencySymbol || "$",
      pricingModel: parsed.pricingModel || "per_person",
      groupSize: parsed.groupSize || 1,
    };
  } catch {
    return {
      currencySymbol: "$",
      pricingModel: "per_person" as "per_person" | "per_group",
      groupSize: 1,
    };
  }
};

// Stringify price field options to JSON
const stringifyPriceOptions = (
  currencySymbol: string,
  pricingModel: "per_person" | "per_group",
  groupSize: number
) => {
  return JSON.stringify({
    currencySymbol,
    pricingModel,
    groupSize,
  });
};

// Parse route field options from JSON string
const parseRouteOptions = (options?: string) => {
  if (!options) {
    return {
      mode: "single" as "single" | "multiple",
      showRoute: false,
      pointLabels: [] as string[],
    };
  }
  try {
    const parsed = JSON.parse(options);
    return {
      mode: parsed.mode || "single",
      showRoute: parsed.showRoute || false,
      pointLabels: parsed.pointLabels || [],
    };
  } catch {
    return {
      mode: "single" as "single" | "multiple",
      showRoute: false,
      pointLabels: [] as string[],
    };
  }
};

// Stringify route field options to JSON
const stringifyRouteOptions = (
  mode: "single" | "multiple",
  showRoute: boolean,
  pointLabels: string[]
) => {
  return JSON.stringify({
    mode,
    showRoute,
    pointLabels,
  });
};

// Default fields that are always present and cannot be deleted
const DEFAULT_FIELDS: FormField[] = [
  {
    name: "name",
    label: "Destination Name",
    type: "text",
    required: true,
    placeholder: "Enter destination name",
    order: 0,
    width: "full",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    required: true,
    placeholder: "Describe the destination",
    order: 1,
    width: "full",
  },
];

// Check if a field is a default field
const isDefaultField = (fieldName: string): boolean => {
  return DEFAULT_FIELDS.some((df) => df.name === fieldName);
};

export function FormFieldManager({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  categoryId: _categoryId,
  initialFields = [],
  onSave,
  onFieldsChange,
}: FormFieldManagerProps) {
  const { handleAsyncAction } = useToastActions();
  
  // Initialize fields: merge default fields with initial fields, ensuring defaults are always present
  const initializeFields = (): FormField[] => {
    if (initialFields.length > 0) {
      // Merge: ensure default fields are present, then add other fields
      const defaultFieldsMap = new Map(
        DEFAULT_FIELDS.map((df) => [df.name, df])
      );
      const otherFields = initialFields.filter(
        (f) => !isDefaultField(f.name)
      );
      
      // Update default fields with any customizations from initialFields
      initialFields.forEach((field) => {
        if (isDefaultField(field.name)) {
          defaultFieldsMap.set(field.name, field);
        }
      });
      
      const mergedDefaults = Array.from(defaultFieldsMap.values()).sort(
        (a, b) => a.order - b.order
      );
      
      // Reorder other fields to start after defaults
      const reorderedOthers = otherFields.map((field, index) => ({
        ...field,
        order: DEFAULT_FIELDS.length + index,
      }));
      
      return [...mergedDefaults, ...reorderedOthers];
    }
    return DEFAULT_FIELDS;
  };

  const [fields, setFields] = useState<FormField[]>(initializeFields);

  const addField = () => {
    // Calculate the next order value (after all existing fields)
    const maxOrder = Math.max(...fields.map((f) => f.order), DEFAULT_FIELDS.length - 1);
    const newField: FormField = {
      name: `field_${Date.now()}`,
      label: "New Field",
      type: "text",
      required: false,
      placeholder: "",
      order: maxOrder + 1,
      width: "full",
    };
    const updatedFields = [...fields, newField];
    setFields(updatedFields);
    // Immediately update preview
    if (onFieldsChange) {
      onFieldsChange(updatedFields);
    }
  };

  const updateField = (index: number, updates: Partial<FormField>) => {
    const updatedFields = fields.map((field, i) =>
      i === index ? { ...field, ...updates } : field
    );
    setFields(updatedFields);
    // Immediately update preview
    if (onFieldsChange) {
      onFieldsChange(updatedFields);
    }
  };

  const removeField = (index: number) => {
    const field = fields[index];
    // Prevent deletion of default fields
    if (isDefaultField(field.name)) {
      return;
    }
    const updatedFields = fields.filter((_, i) => i !== index);
    // Reorder remaining fields
    const reorderedFields = updatedFields.map((field, i) => ({
      ...field,
      order: i,
    }));
    setFields(reorderedFields);
    // Immediately update preview
    if (onFieldsChange) {
      onFieldsChange(reorderedFields);
    }
  };

  const moveField = (index: number, direction: "up" | "down") => {
    const field = fields[index];
    // Prevent moving default fields out of their position
    if (isDefaultField(field.name)) {
      const defaultFieldIndex = DEFAULT_FIELDS.findIndex(
        (df) => df.name === field.name
      );
      const newIndex = direction === "up" ? index - 1 : index + 1;
      // Don't allow default fields to move outside their range
      if (
        direction === "up" &&
        (newIndex < 0 || newIndex < defaultFieldIndex)
      ) {
        return;
      }
      if (
        direction === "down" &&
        (newIndex >= fields.length || newIndex >= DEFAULT_FIELDS.length)
      ) {
        return;
      }
    }

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= fields.length) return;

    const updatedFields = [...fields];
    [updatedFields[index], updatedFields[newIndex]] = [
      updatedFields[newIndex],
      updatedFields[index],
    ];
    // Update order values
    const reorderedFields = updatedFields.map((field, i) => ({
      ...field,
      order: i,
    }));
    setFields(reorderedFields);
    // Immediately update preview
    if (onFieldsChange) {
      onFieldsChange(reorderedFields);
    }
  };

  const handleSave = async () => {
    await handleAsyncAction(
      () => onSave(fields),
      "Form configuration saved successfully!",
      "Failed to save form configuration. Please try again.",
      "Saving form configuration..."
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Form Fields Configuration</h3>
          <Button onClick={addField} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Field
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          <strong>Note:</strong> Category and Subcategory fields are always present. 
          The default fields (Name and Description) cannot be deleted but can be customized. 
          Add additional fields as needed.
        </p>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <CardTitle className="text-sm">
                    {field.label || "Untitled Field"}
                  </CardTitle>
                  {isDefaultField(field.name) && (
                    <Badge variant="secondary" className="text-xs">
                      Default
                    </Badge>
                  )}
                  {field.required && (
                    <Badge variant="destructive" className="text-xs">
                      Required
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {field.width === "half" ? "Half Width" : "Full Width"}
                  </Badge>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveField(index, "up")}
                    disabled={
                      index === 0 ||
                      (isDefaultField(field.name) && index < DEFAULT_FIELDS.length)
                    }
                    title={
                      isDefaultField(field.name) && index < DEFAULT_FIELDS.length
                        ? "Default fields have fixed positions"
                        : "Move up"
                    }
                  >
                    ↑
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveField(index, "down")}
                    disabled={
                      index === fields.length - 1 ||
                      (isDefaultField(field.name) && index >= DEFAULT_FIELDS.length - 1)
                    }
                    title={
                      isDefaultField(field.name) && index >= DEFAULT_FIELDS.length - 1
                        ? "Default fields have fixed positions"
                        : "Move down"
                    }
                  >
                    ↓
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeField(index)}
                    disabled={isDefaultField(field.name)}
                    className="text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={
                      isDefaultField(field.name)
                        ? "Default fields cannot be deleted"
                        : "Delete field"
                    }
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`name-${index}`}>Field Name</Label>
                  <Input
                    id={`name-${index}`}
                    value={field.name}
                    onChange={(e) =>
                      updateField(index, { name: e.target.value })
                    }
                    placeholder="field_name"
                  />
                </div>
                <div>
                  <Label htmlFor={`label-${index}`}>Field Label</Label>
                  <Input
                    id={`label-${index}`}
                    value={field.label}
                    onChange={(e) =>
                      updateField(index, { label: e.target.value })
                    }
                    placeholder="Field Label"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label htmlFor={`type-${index}`}>Field Type</Label>
                  <Select
                    value={field.type}
                    onValueChange={(value) => {
                      // Initialize price field with default options when type is changed to price
                      if (value === "price" && field.type !== "price") {
                        const defaultPriceOptions = stringifyPriceOptions(
                          "$",
                          "per_person",
                          1
                        );
                        updateField(index, {
                          type: value,
                          options: defaultPriceOptions,
                        });
                      } else if (value === "route" && field.type !== "route") {
                        // Initialize route field with default options
                        const defaultRouteOptions = stringifyRouteOptions(
                          "single",
                          false,
                          []
                        );
                        updateField(index, {
                          type: value,
                          options: defaultRouteOptions,
                        });
                      } else {
                        updateField(index, { type: value });
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FIELD_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`width-${index}`}>Field Width</Label>
                  <Select
                    value={field.width || "full"}
                    onValueChange={(value: "half" | "full") =>
                      updateField(index, { width: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full Width</SelectItem>
                      <SelectItem value="half">Half Width</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`required-${index}`}
                    checked={field.required}
                    onChange={(e) =>
                      updateField(index, { required: e.target.checked })
                    }
                    className="rounded"
                  />
                  <Label htmlFor={`required-${index}`}>Required Field</Label>
                </div>
              </div>

              <div>
                <Label htmlFor={`placeholder-${index}`}>Placeholder</Label>
                <Input
                  id={`placeholder-${index}`}
                  value={field.placeholder || ""}
                  onChange={(e) =>
                    updateField(index, { placeholder: e.target.value })
                  }
                  placeholder="Enter placeholder text"
                />
              </div>

              {field.type === "price" && (() => {
                const priceOptions = parsePriceOptions(field.options);
                return (
                  <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
                    <h4 className="text-sm font-medium text-gray-700">
                      Price Field Configuration
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`currency-${index}`}>
                          Currency Symbol
                        </Label>
                        <Input
                          id={`currency-${index}`}
                          value={priceOptions.currencySymbol}
                          onChange={(e) => {
                            const newOptions = stringifyPriceOptions(
                              e.target.value,
                              priceOptions.pricingModel,
                              priceOptions.groupSize
                            );
                            updateField(index, { options: newOptions });
                          }}
                          placeholder="$"
                          maxLength={5}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          e.g., $, €, ₹, £
                        </p>
                      </div>
                      <div>
                        <Label htmlFor={`pricing-model-${index}`}>
                          Pricing Model
                        </Label>
                        <Select
                          value={priceOptions.pricingModel}
                          onValueChange={(value: "per_person" | "per_group") => {
                            const newOptions = stringifyPriceOptions(
                              priceOptions.currencySymbol,
                              value,
                              priceOptions.groupSize
                            );
                            updateField(index, { options: newOptions });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="per_person">Per Person</SelectItem>
                            <SelectItem value="per_group">Per Group</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {priceOptions.pricingModel === "per_group" && (
                      <div>
                        <Label htmlFor={`group-size-${index}`}>
                          Group Size
                        </Label>
                        <Input
                          id={`group-size-${index}`}
                          type="number"
                          min="1"
                          value={priceOptions.groupSize}
                          onChange={(e) => {
                            const groupSize = parseInt(e.target.value) || 1;
                            const newOptions = stringifyPriceOptions(
                              priceOptions.currencySymbol,
                              priceOptions.pricingModel,
                              groupSize
                            );
                            updateField(index, { options: newOptions });
                          }}
                          placeholder="Number of people per group"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Number of people included in the group price
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}

              {field.type === "route" && (() => {
                const routeOptions = parseRouteOptions(field.options);
                return (
                  <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
                    <h4 className="text-sm font-medium text-gray-700">
                      Route Field Configuration
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`route-mode-${index}`}>
                          Point Mode
                        </Label>
                        <Select
                          value={routeOptions.mode}
                          onValueChange={(value: "single" | "multiple") => {
                            const newLabels =
                              value === "multiple"
                                ? routeOptions.pointLabels.length > 0
                                  ? routeOptions.pointLabels
                                  : ["Start", "Destination"]
                                : [];
                            const newOptions = stringifyRouteOptions(
                              value,
                              routeOptions.showRoute,
                              newLabels
                            );
                            updateField(index, { options: newOptions });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single">Single Point</SelectItem>
                            <SelectItem value="multiple">
                              Multiple Points
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500 mt-1">
                          Single point or multiple points (e.g., trail route)
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 pt-6">
                        <input
                          type="checkbox"
                          id={`show-route-${index}`}
                          checked={routeOptions.showRoute}
                          onChange={(e) => {
                            const newOptions = stringifyRouteOptions(
                              routeOptions.mode,
                              e.target.checked,
                              routeOptions.pointLabels
                            );
                            updateField(index, { options: newOptions });
                          }}
                          className="rounded"
                        />
                        <Label htmlFor={`show-route-${index}`}>
                          Show Route Line
                        </Label>
                      </div>
                    </div>
                    {routeOptions.mode === "multiple" && (
                      <div>
                        <Label htmlFor={`point-labels-${index}`}>
                          Point Labels (one per line, in order)
                        </Label>
                        <Textarea
                          id={`point-labels-${index}`}
                          value={routeOptions.pointLabels.join("\n")}
                          onChange={(e) => {
                            const labels = e.target.value
                              .split("\n")
                              .map((l) => l.trim())
                              .filter((l) => l.length > 0);
                            const newOptions = stringifyRouteOptions(
                              routeOptions.mode,
                              routeOptions.showRoute,
                              labels
                            );
                            updateField(index, { options: newOptions });
                          }}
                          placeholder="Start&#10;First Meet Point&#10;Second Meet Point&#10;Destination"
                          rows={4}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Labels for each point in order (e.g., Start, First Meet
                          Point, Destination)
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}

              {(field.type === "select" || field.type === "radio") && (
                <div>
                  <Label htmlFor={`options-${index}`}>
                    Options (one per line)
                  </Label>
                  <Textarea
                    id={`options-${index}`}
                    value={field.options || ""}
                    onChange={(e) =>
                      updateField(index, { options: e.target.value })
                    }
                    placeholder="Option 1&#10;Option 2&#10;Option 3"
                    rows={3}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Form Configuration</Button>
      </div>
    </div>
  );
}

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
  { value: "date", label: "Date" },
  { value: "time", label: "Time" },
  { value: "dateTime", label: "Date & Time" },
  { value: "location", label: "Location (Mapbox)" },
  { value: "image", label: "Image Upload" },
  { value: "select", label: "Select Dropdown" },
  { value: "radio", label: "Radio Buttons" },
  { value: "checkbox", label: "Checkbox" },
];

export function FormFieldManager({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  categoryId: _categoryId,
  initialFields = [],
  onSave,
  onFieldsChange,
}: FormFieldManagerProps) {
  const { handleAsyncAction } = useToastActions();
  const [fields, setFields] = useState<FormField[]>(
    initialFields.length > 0
      ? initialFields
      : [
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
          {
            name: "location",
            label: "Location",
            type: "text",
            required: true,
            placeholder: "Enter location",
            order: 2,
            width: "full",
          },
          {
            name: "latitude",
            label: "Latitude",
            type: "number",
            required: true,
            placeholder: "Enter latitude",
            order: 3,
            width: "half",
          },
          {
            name: "longitude",
            label: "Longitude",
            type: "number",
            required: true,
            placeholder: "Enter longitude",
            order: 4,
            width: "half",
          },
          {
            name: "pickupLocation",
            label: "Pickup Location",
            type: "text",
            required: true,
            placeholder: "Enter pickup location",
            order: 5,
            width: "full",
          },
          {
            name: "price",
            label: "Price",
            type: "number",
            required: true,
            placeholder: "Enter price",
            order: 6,
            width: "half",
          },
          {
            name: "imageUrl",
            label: "Main Image",
            type: "image",
            required: false,
            placeholder: "Upload or enter image URL",
            order: 7,
            width: "full",
          },
          {
            name: "startTime",
            label: "Start Time",
            type: "time",
            required: false,
            placeholder: "Select start time",
            order: 8,
            width: "half",
          },
          {
            name: "endTime",
            label: "End Time",
            type: "time",
            required: false,
            placeholder: "Select end time",
            order: 9,
            width: "half",
          },
          {
            name: "meetingPoint",
            label: "Meeting Point",
            type: "location",
            required: false,
            placeholder: "Search for meeting point...",
            order: 10,
            width: "full",
          },
          {
            name: "dropOffPoint",
            label: "Drop-off Point",
            type: "location",
            required: false,
            placeholder: "Search for drop-off point...",
            order: 11,
            width: "full",
          },
          {
            name: "startDateTime",
            label: "Start Date & Time",
            type: "dateTime",
            required: false,
            placeholder: "Select start date and time",
            order: 12,
            width: "half",
          },
          {
            name: "endDateTime",
            label: "End Date & Time",
            type: "dateTime",
            required: false,
            placeholder: "Select end date and time",
            order: 13,
            width: "half",
          },
        ]
  );

  const addField = () => {
    const newField: FormField = {
      name: `field_${Date.now()}`,
      label: "New Field",
      type: "text",
      required: false,
      placeholder: "",
      order: fields.length,
      width: "full",
    };
    const updatedFields = [...fields, newField];
    setFields(updatedFields);
    if (onFieldsChange) {
      onFieldsChange(updatedFields);
    }
  };

  const updateField = (index: number, updates: Partial<FormField>) => {
    const updatedFields = fields.map((field, i) =>
      i === index ? { ...field, ...updates } : field
    );
    setFields(updatedFields);
    if (onFieldsChange) {
      onFieldsChange(updatedFields);
    }
  };

  const removeField = (index: number) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
    if (onFieldsChange) {
      onFieldsChange(updatedFields);
    }
  };

  const moveField = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= fields.length) return;

    const updatedFields = [...fields];
    [updatedFields[index], updatedFields[newIndex]] = [
      updatedFields[newIndex],
      updatedFields[index],
    ];
    setFields(updatedFields);
    if (onFieldsChange) {
      onFieldsChange(updatedFields);
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
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Form Fields Configuration</h3>
        <Button onClick={addField} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Field
        </Button>
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
                    disabled={index === 0}
                  >
                    ↑
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveField(index, "down")}
                    disabled={index === fields.length - 1}
                  >
                    ↓
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeField(index)}
                    className="text-red-600"
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
                    onValueChange={(value) =>
                      updateField(index, { type: value })
                    }
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

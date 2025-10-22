"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormFieldManager } from "@/components/form-field-manager";
import { FormPreview } from "@/components/form-preview";

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

interface FormConfigLayoutProps {
  categoryId: string;
  categoryName: string;
  initialFields: FormField[];
  onSave: (fields: FormField[]) => Promise<void>;
}

export function FormConfigLayout({
  categoryId,
  categoryName,
  initialFields,
  onSave,
}: FormConfigLayoutProps) {
  const [fields, setFields] = useState<FormField[]>(initialFields);

  const handleFieldsChange = (updatedFields: FormField[]) => {
    setFields(updatedFields);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form Configuration */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Form Configuration</CardTitle>
            <p className="text-sm text-gray-600">
              Configure the form fields that will be used when creating
              destinations in the &quot;{categoryName}&quot; category.
            </p>
          </CardHeader>
          <CardContent>
            <FormFieldManager
              categoryId={categoryId}
              initialFields={initialFields}
              onSave={onSave}
              onFieldsChange={handleFieldsChange}
            />
          </CardContent>
        </Card>
      </div>

      {/* Form Preview */}
      <div>
        <FormPreview fields={fields} categoryName={categoryName} />
      </div>
    </div>
  );
}

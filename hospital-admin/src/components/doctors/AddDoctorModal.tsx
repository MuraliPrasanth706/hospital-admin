"use client";

import { useState, useCallback } from "react";
import { Modal } from "@/src/components/ui/Modal";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { extractApiError } from "@/src/lib/apiClient";
import type { AddDoctorFormValues } from "@/src/types";

interface AddDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Async — modal stays open and shows error on API failure. */
  onSubmit: (values: AddDoctorFormValues) => Promise<void>;
}

const EMPTY_FORM: AddDoctorFormValues = {
  name: "",
  specialty: "",
  avgConsultMinutes: "",
  experienceYears: "",
};

export function AddDoctorModal({ isOpen, onClose, onSubmit }: AddDoctorModalProps) {
  const [form, setForm] = useState<AddDoctorFormValues>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback(
    (field: keyof AddDoctorFormValues) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
      },
    [],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit(form);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    if (submitting) return;
    onClose();
    setForm(EMPTY_FORM);
    setError(null);
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add a new doctor"
      description="Will be added to Apollo Hospital."
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label="Full name"
          placeholder="Dr. Anjali Mehta"
          value={form.name}
          onChange={handleChange("name")}
          required
          autoFocus
        />
        <Input
          label="Specialization"
          placeholder="General Physician"
          value={form.specialty}
          onChange={handleChange("specialty")}
          required
        />
        <Input
          label="Avg consultation (min)"
          type="number"
          placeholder="10"
          min={1}
          value={form.avgConsultMinutes}
          onChange={handleChange("avgConsultMinutes")}
        />
        <Input
          label="Experience (yrs)"
          type="number"
          placeholder="5"
          min={0}
          value={form.experienceYears}
          onChange={handleChange("experienceYears")}
        />

        {error && (
          <p role="alert" className="text-sm text-red-600 font-medium">
            {error}
          </p>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Adding\u2026" : "Add doctor"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

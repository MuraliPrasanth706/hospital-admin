"use client";

import { useMemo, useCallback } from "react";
import { useDoctorsStore } from "@/src/store/doctorsStore";
import { useAsync } from "@/src/hooks/useAsync";
import { getDoctorsSummary, createDoctor } from "@/src/services/doctors.service";
import type { ApiDoctorSummary } from "@/src/services/doctors.service";
import { filterByNameOrSpecialty } from "@/src/lib/utils";
import { PageHeader } from "@/src/components/layout/PageHeader";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { DoctorCard } from "@/src/components/doctors/DoctorCard";
import { AddDoctorModal } from "@/src/components/doctors/AddDoctorModal";
import { Spinner } from "@/src/components/ui/Spinner";
import { ErrorBanner } from "@/src/components/ui/ErrorBanner";
import type { Doctor, AddDoctorFormValues } from "@/src/types";

// ─── Data mapping ─────────────────────────────────────────────────────────────

function mapApiDoctor(d: ApiDoctorSummary): Doctor {
  return {
    id: d.id,
    initial: d.name.trim()[0]?.toUpperCase() ?? "D",
    name: d.name,
    specialty: d.specialization,
    rating: 0,
    experienceYears: d.experience_years ?? 0,
    inQueue: d.appointment_count,
    avgConsultMinutes: d.avg_consult_minutes ?? 10,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DoctorsPage() {
  const { searchQuery, setSearchQuery, isModalOpen, openModal, closeModal } =
    useDoctorsStore();

  const { data, loading, error, refetch } = useAsync(
    () => getDoctorsSummary(),
    [],
  );

  const doctors: Doctor[] = useMemo(
    () => (data ?? []).map(mapApiDoctor),
    [data],
  );

  const filtered = useMemo(
    () => filterByNameOrSpecialty(doctors, searchQuery),
    [doctors, searchQuery],
  );

  const handleAddDoctor = useCallback(
    async (values: AddDoctorFormValues) => {
      await createDoctor({
        name: values.name.trim(),
        specialization: values.specialty.trim(),
        experience_years: values.experienceYears ? parseInt(values.experienceYears, 10) : 0,
        avg_consult_minutes: values.avgConsultMinutes ? parseInt(values.avgConsultMinutes, 10) : 10,
      });
      closeModal();
      refetch();
    },
    [closeModal, refetch],
  );

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Doctor Management" subtitle={`Apollo Hospital \u00b7 All doctors`} />

      <div className="flex-1 p-4 sm:p-6 lg:p-4 sm:p-6 lg:p-8 space-y-5 overflow-y-auto">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="w-full sm:w-full sm:w-80">
            <Input
              label=""
              placeholder="Search doctors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search doctors"
            />
          </div>
          <Button variant="primary" onClick={openModal}>
            + Add doctor
          </Button>
        </div>

        {error && <ErrorBanner message={error} onRetry={refetch} />}

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Spinner size="lg" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-16">
            {searchQuery ? "No doctors matched your search." : "No doctors found."}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5" aria-label="Doctors">
            {filtered.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )}
      </div>

      <AddDoctorModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleAddDoctor}
      />
    </div>
  );
}

"use client";

import { useMemo } from "react";
import { useAsync } from "@/src/hooks/useAsync";
import { getClinicAppointments } from "@/src/services/appointments.service";
import type { ApiAppointment, ApiAppointmentStatus } from "@/src/services/appointments.service";
import { PageHeader } from "@/src/components/layout/PageHeader";
import { StatCard } from "@/src/components/ui/StatCard";
import { AppointmentsTable } from "@/src/components/dashboard/AppointmentsTable";
import { Spinner } from "@/src/components/ui/Spinner";
import { ErrorBanner } from "@/src/components/ui/ErrorBanner";
import type { Appointment, AppointmentStatus, StatCard as StatCardType } from "@/src/types";

// ─── Data mapping ─────────────────────────────────────────────────────────────

const STATUS_MAP: Record<ApiAppointmentStatus, AppointmentStatus> = {
  scheduled: "Waiting",
  checked_in: "Waiting",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Completed",
  skipped: "Completed",
};

function mapAppointment(apt: ApiAppointment, waitingIndex: number): Appointment {
  const isActive = apt.status === "in_progress";
  const isDone = apt.status === "completed" || apt.status === "cancelled" || apt.status === "skipped";

  return {
    token: apt.token.substring(0, 8).toUpperCase(),
    patientName: apt.patient_name,
    patientInitial: apt.patient_name.charAt(0).toUpperCase(),
    doctorName: apt.doctor_name,
    position: isActive ? "\u2014" : isDone ? "\u2014" : `#${waitingIndex + 1}`,
    eta: isActive ? "Now" : isDone ? "\u2014" : `${(waitingIndex + 1) * 8}m`,
    status: STATUS_MAP[apt.status],
    appointmentDate: apt.appointment_date,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { data: rawAppointments, loading, error, refetch } = useAsync(
    () => getClinicAppointments(),
    [],
  );

  const { appointments, stats } = useMemo(() => {
    if (!rawAppointments) return { appointments: [], stats: null };

    let waitingIdx = 0;
    const mapped = rawAppointments.map((apt) => {
      const isWaiting = apt.status === "scheduled" || apt.status === "checked_in";
      const row = mapAppointment(apt, isWaiting ? waitingIdx : 0);
      if (isWaiting) waitingIdx++;
      return row;
    });

    const inProgress = rawAppointments.filter((a) => a.status === "in_progress").length;
    const waiting = rawAppointments.filter((a) => a.status === "scheduled" || a.status === "checked_in").length;
    const completed = rawAppointments.filter((a) => a.status === "completed").length;

    // Count unique doctors
    const doctorSet = new Set(rawAppointments.map((a) => a.doctor_name));

    const statCards: StatCardType[] = [
      { label: "Patients today", value: rawAppointments.length, subLabel: "All appointments", dotColor: "bg-blue-500" },
      { label: "Active in queue", value: waiting + inProgress, subLabel: `${inProgress} in consultation`, dotColor: "bg-amber-400" },
      { label: "Doctors on duty", value: doctorSet.size, subLabel: "Across this clinic", dotColor: "bg-emerald-500" },
      { label: "Completed", value: completed, subLabel: "Finished today", dotColor: "bg-gray-400" },
    ];

    return { appointments: mapped, stats: statCards };
  }, [rawAppointments]);

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Dashboard" subtitle={`Apollo Hospital \u00b7 Today's overview`} />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 overflow-y-auto">
        {error && <ErrorBanner message={error} onRetry={refetch} />}

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:lg:grid-cols-4 gap-3 sm:gap-5" aria-label="Today's statistics">
              {(stats ?? []).map((s) => (
                <StatCard key={s.label} {...s} />
              ))}
            </div>

            {/* Appointments table */}
            <AppointmentsTable appointments={appointments} />
          </>
        )}
      </div>
    </div>
  );
}

"use client";

"use client";

import { useMemo, useCallback, useEffect } from "react";
import { useQueueStore } from "@/src/store/queueStore";
import { useAsync } from "@/src/hooks/useAsync";
import { getDoctorsSummary } from "@/src/services/doctors.service";
import { getAppointmentsByDoctor } from "@/src/services/appointments.service";
import type { ApiAppointment } from "@/src/services/appointments.service";
import { PageHeader } from "@/src/components/layout/PageHeader";
import { StatCard } from "@/src/components/ui/StatCard";
import { DoctorTabs } from "@/src/components/queue/DoctorTabs";
import { CurrentPatientPanel } from "@/src/components/queue/CurrentPatientPanel";
import { UpNextPanel } from "@/src/components/queue/UpNextPanel";
import { Spinner } from "@/src/components/ui/Spinner";
import { ErrorBanner } from "@/src/components/ui/ErrorBanner";
import type { CurrentPatient, QueuePatient, StatCard as StatCardType } from "@/src/types";

// ─── Derive queue state from appointment list ─────────────────────────────────

const AVG_CONSULT_MINUTES = 8; // fallback until API exposes this

interface DerivedQueue {
  current: CurrentPatient | null;
  upNext: QueuePatient[];
  stats: { inConsultation: number; waiting: number; completed: number };
}

function deriveQueue(appointments: ApiAppointment[]): DerivedQueue {
  const inProgress = appointments.filter((a) => a.status === "in_progress");
  const waiting = appointments.filter(
    (a) => a.status === "scheduled" || a.status === "checked_in",
  );
  const completed = appointments.filter((a) => a.status === "completed").length;

  const current: CurrentPatient | null = inProgress[0]
    ? {
        name: inProgress[0].patient_name,
        token: inProgress[0].token.substring(0, 8).toUpperCase(),
        phone: "N/A",
        initial: inProgress[0].patient_name.charAt(0).toUpperCase(),
      }
    : null;

  const upNext: QueuePatient[] = waiting.map((apt, i) => ({
    position: i + 1,
    name: apt.patient_name,
    token: apt.token.substring(0, 8).toUpperCase(),
    eta: `${(i + 1) * AVG_CONSULT_MINUTES}m`,
  }));

  return {
    current,
    upNext,
    stats: {
      inConsultation: inProgress.length,
      waiting: waiting.length,
      completed,
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function QueuePage() {
  const { activeDoctorId, delays, setActiveDoctor, incrementDelay, decrementDelay } =
    useQueueStore();

  // 1. Fetch doctors list
  const { data: doctors, loading: doctorsLoading, error: doctorsError } = useAsync(
    () => getDoctorsSummary(),
    [],
  );

  // 2. Auto-select first doctor when list loads
  useEffect(() => {
    if (doctors && doctors.length > 0 && activeDoctorId === null) {
      setActiveDoctor(doctors[0].id);
    }
  }, [doctors, activeDoctorId, setActiveDoctor]);

  // 3. Fetch appointments for the active doctor
  const {
    data: appointments,
    loading: apptLoading,
    error: apptError,
    refetch: refetchAppts,
  } = useAsync(
    () =>
      activeDoctorId
        ? getAppointmentsByDoctor(activeDoctorId)
        : Promise.resolve([] as ApiAppointment[]),
    [activeDoctorId],
  );

  const queue = useMemo(
    () => deriveQueue(appointments ?? []),
    [appointments],
  );

  const currentDelay = (activeDoctorId ? delays[activeDoctorId] : null) ?? 0;

  const activeDoctor = doctors?.find((d) => d.id === activeDoctorId);

  const handleSelectDoctor = useCallback(
    (id: string) => setActiveDoctor(id),
    [setActiveDoctor],
  );

  const handleIncrement = useCallback(
    () => activeDoctorId && incrementDelay(activeDoctorId),
    [activeDoctorId, incrementDelay],
  );

  const handleDecrement = useCallback(
    () => activeDoctorId && decrementDelay(activeDoctorId),
    [activeDoctorId, decrementDelay],
  );

  const queueStats: StatCardType[] = [
    { label: "In consultation", value: queue.stats.inConsultation, subLabel: "", dotColor: "bg-blue-500" },
    { label: "Waiting", value: queue.stats.waiting, subLabel: "", dotColor: "bg-amber-400" },
    { label: "Completed", value: queue.stats.completed, subLabel: "", dotColor: "bg-emerald-500" },
    { label: "Delay", value: `${currentDelay}m`, subLabel: "", dotColor: "bg-gray-400" },
  ];

  const doctorTabs = (doctors ?? []).map((d) => ({
    id: d.id,
    name: d.name,
    specialty: d.specialization,
  }));

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Queue Management"
        subtitle={
          activeDoctor
            ? `${activeDoctor.name} \u00b7 ${activeDoctor.specialization}`
            : "Select a doctor"
        }
      />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5 overflow-y-auto">
        {(doctorsError || apptError) && (
          <ErrorBanner
            message={doctorsError ?? apptError ?? "Failed to load queue data."}
            onRetry={apptError ? refetchAppts : undefined}
          />
        )}

        {doctorsLoading ? (
          <div className="flex items-center justify-center h-48">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            {/* Doctor tabs */}
            {activeDoctorId && (
              <DoctorTabs
                doctors={doctorTabs}
                activeId={activeDoctorId}
                onSelect={handleSelectDoctor}
              />
            )}

            {/* Stats */}
            {activeDoctorId && (
              <div
                id={`queue-panel-${activeDoctorId}`}
                role="tabpanel"
                aria-labelledby={`tab-${activeDoctorId}`}
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5"
              >
                {queueStats.map((s) => (
                  <StatCard key={s.label} {...s} compact />
                ))}
              </div>
            )}

            {/* Main panels */}
            {apptLoading ? (
              <div className="flex items-center justify-center h-32">
                <Spinner />
              </div>
            ) : activeDoctorId ? (
              <div className="flex flex-col lg:flex-row gap-5">
                <CurrentPatientPanel
                  patient={queue.current ?? {
                    name: "No active patient",
                    token: "\u2014",
                    phone: "\u2014",
                    initial: "?",
                  }}
                  hasPatient={queue.current !== null && queue.current !== undefined}
                  delayMinutes={currentDelay}
                  onIncrementDelay={handleIncrement}
                  onDecrementDelay={handleDecrement}
                />
                <UpNextPanel patients={queue.upNext} />
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

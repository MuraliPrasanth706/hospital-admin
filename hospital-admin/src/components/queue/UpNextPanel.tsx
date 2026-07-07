import { memo } from "react";
import type { QueuePatient } from "@/src/types";

// ─── Icons ────────────────────────────────────────────────────────────────────

function ChevronRightIcon() {
  return (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
    </svg>
  );
}

// ─── PatientQueueItem ─────────────────────────────────────────────────────────

interface PatientQueueItemProps {
  patient: QueuePatient;
}

function PatientQueueItem({ patient }: PatientQueueItemProps) {
  return (
    <li className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
      <div
        aria-hidden="true"
        className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[#2563EB] text-xs font-bold flex-shrink-0"
      >
        #{patient.position}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">
          {patient.name}
        </p>
        <p className="text-xs text-gray-400">
          {patient.token} · ETA {patient.eta}
        </p>
      </div>
      <div className="flex gap-1.5 flex-shrink-0" role="group" aria-label={`Actions for ${patient.name}`}>
        <button
          aria-label={`Mark ${patient.name} as emergency`}
          className="w-7 h-7 rounded-lg border border-red-200 text-red-400 hover:bg-red-50 flex items-center justify-center text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
        >
          !
        </button>
        <button
          aria-label={`Skip ${patient.name}`}
          className="w-7 h-7 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </li>
  );
}

// ─── UpNextPanel ──────────────────────────────────────────────────────────────

interface UpNextPanelProps {
  patients: QueuePatient[];
}

export const UpNextPanel = memo(function UpNextPanel({ patients }: UpNextPanelProps) {
  return (
    <section
      aria-label="Up next queue"
      className="w-full lg:w-80 flex-shrink-0 bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col"
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-gray-900">Up next</h2>
        <span
          aria-live="polite"
          className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full"
        >
          {patients.length} patients
        </span>
      </div>

      {patients.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">No patients in queue</p>
      ) : (
        <ul className="space-y-1 flex-1" aria-label="Queue list">
          {patients.map((p) => (
            <PatientQueueItem key={p.token} patient={p} />
          ))}
        </ul>
      )}
    </section>
  );
});

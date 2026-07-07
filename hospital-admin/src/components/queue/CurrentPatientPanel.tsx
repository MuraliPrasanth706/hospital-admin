import { memo } from "react";
import { Button } from "@/src/components/ui/Button";
import { Avatar } from "@/src/components/ui/Avatar";
import type { CurrentPatient } from "@/src/types";

// ─── Icons ────────────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="5" width="14" height="14" rx="1" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

// ─── Delay Control ────────────────────────────────────────────────────────────

interface DelayControlProps {
  delayMinutes: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

function DelayControl({ delayMinutes, onIncrement, onDecrement }: DelayControlProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 rounded-xl px-5 py-4">
        <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
          <ClockIcon />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800">Delay control</p>
          <p className="text-xs text-gray-500 whitespace-nowrap">
            Currently delayed by {delayMinutes} min
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3" role="group" aria-label="Adjust delay">
        <button
          onClick={onDecrement}
          aria-label="Decrease delay by 5 minutes"
          className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-700 font-bold hover:bg-gray-100 transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          −
        </button>
        <span
          aria-live="polite"
          aria-label={`Current delay: ${delayMinutes} minutes`}
          className="text-sm font-semibold text-gray-800 w-8 text-center tabular-nums"
        >
          {delayMinutes}m
        </span>
        <button
          onClick={onIncrement}
          aria-label="Increase delay by 5 minutes"
          className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-700 font-bold hover:bg-gray-100 transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          +
        </button>
      </div>
    </div>
  );
}

// ─── CurrentPatientPanel ──────────────────────────────────────────────────────

interface CurrentPatientPanelProps {
  patient: CurrentPatient;
  hasPatient: boolean;
  delayMinutes: number;
  onIncrementDelay: () => void;
  onDecrementDelay: () => void;
}

export const CurrentPatientPanel = memo(function CurrentPatientPanel({
  patient,
  hasPatient,
  delayMinutes,
  onIncrementDelay,
  onDecrementDelay,
}: CurrentPatientPanelProps) {
  return (
    <section
      aria-label="Current patient"
      className="flex-1 min-w-0 bg-white rounded-xl border-2 border-[#2563EB] shadow-sm p-6 space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-400 tracking-widest uppercase">
          Current Patient
        </span>
        <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full border border-blue-100">
          In Progress
        </span>
      </div>

      {/* Patient identity */}
      <div className="flex items-center gap-4">
        <Avatar initial={patient.initial} size="lg" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{patient.name}</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {patient.token} · {patient.phone}
          </p>
        </div>
      </div>

      {/* Actions — only shown when a patient is active */}
      {hasPatient && (
        <div className="grid grid-cols-2 gap-3" role="group" aria-label="Patient actions">
          <Button variant="success" className="py-3 rounded-xl">
            <CheckIcon />
            Complete
          </Button>
          <Button variant="secondary" className="py-3 rounded-xl">
            <ChevronRightIcon />
            Skip patient
          </Button>
          <Button variant="danger" className="py-3 rounded-xl">
            <span className="font-bold text-base leading-none" aria-hidden="true">!</span>
            Mark emergency
          </Button>
          <Button variant="primary" className="py-3 rounded-xl">
            <StopIcon />
            Start next consultation
          </Button>
        </div>
      )}

      {/* Delay */}
      <DelayControl
        delayMinutes={delayMinutes}
        onIncrement={onIncrementDelay}
        onDecrement={onDecrementDelay}
      />
    </section>
  );
});

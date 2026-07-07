import type { Appointment } from "@/src/types";
import { Avatar } from "@/src/components/ui/Avatar";
import { StatusBadge } from "@/src/components/ui/StatusBadge";
import Link from "next/link";

interface AppointmentsTableProps {
  appointments: Appointment[];
}

const COLUMNS = ["TOKEN", "PATIENT", "DOCTOR", "POSITION", "ETA", "STATUS"] as const;

export function AppointmentsTable({ appointments }: AppointmentsTableProps) {
  return (
    <section aria-label="Today's appointments" className="bg-white rounded-xl border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Today&apos;s appointments
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Live queue across all doctors at Apollo Hospital
          </p>
        </div>
        <Link
          href="/queue"
          className="text-sm font-medium text-gray-700 border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Manage queue
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full" aria-label="Appointments">
          <thead>
            <tr className="border-b border-gray-100">
              <th scope="col" className="text-left text-xs font-semibold text-gray-400 tracking-wider px-4 sm:px-6 py-3">TOKEN</th>
              <th scope="col" className="text-left text-xs font-semibold text-gray-400 tracking-wider px-4 sm:px-6 py-3">PATIENT</th>
              <th scope="col" className="hidden md:table-cell text-left text-xs font-semibold text-gray-400 tracking-wider px-6 py-3">DOCTOR</th>
              <th scope="col" className="hidden sm:table-cell text-left text-xs font-semibold text-gray-400 tracking-wider px-6 py-3">POSITION</th>
              <th scope="col" className="hidden sm:table-cell text-left text-xs font-semibold text-gray-400 tracking-wider px-6 py-3">ETA</th>
              <th scope="col" className="text-left text-xs font-semibold text-gray-400 tracking-wider px-4 sm:px-6 py-3">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {appointments.map((appt) => (
              <tr key={appt.token} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 sm:px-6 py-4 text-xs text-gray-400 font-mono">{appt.token}</td>
                <td className="px-4 sm:px-6 py-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Avatar initial={appt.patientInitial} size="sm" />
                    <span className="text-sm font-semibold text-gray-900 truncate max-w-[100px] sm:max-w-none">
                      {appt.patientName}
                    </span>
                  </div>
                </td>
                <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-500">{appt.doctorName}</td>
                <td className="hidden sm:table-cell px-6 py-4 text-sm font-bold text-gray-900">{appt.position}</td>
                <td className="hidden sm:table-cell px-6 py-4 text-sm text-gray-500">{appt.eta}</td>
                <td className="px-4 sm:px-6 py-4"><StatusBadge status={appt.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

import { memo } from "react";
import type { Doctor } from "@/src/types";
import { Avatar } from "@/src/components/ui/Avatar";
import { formatMinutes } from "@/src/lib/utils";

interface DoctorCardProps {
  doctor: Doctor;
}

export const DoctorCard = memo(function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <article
      aria-label={`${doctor.name}, ${doctor.specialty}`}
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
    >
      {/* Identity */}
      <div className="flex items-start gap-4 mb-5">
        <Avatar initial={doctor.initial} size="md" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">{doctor.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">{doctor.specialty}</p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span
              aria-hidden="true"
              className="w-2 h-2 rounded-full bg-amber-400"
            />
            <span className="text-xs text-gray-600 font-medium">
              {doctor.rating > 0 ? doctor.rating : "—"}
            </span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-500">
              {doctor.experienceYears} yrs
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center border-t border-gray-100 pt-4">
        <div className="flex-1 text-center">
          <p
            className="text-2xl font-bold text-[#2563EB]"
            aria-label={`${doctor.inQueue} patients in queue`}
          >
            {doctor.inQueue}
          </p>
          <p className="text-xs text-gray-400 font-medium mt-0.5 tracking-wider uppercase">
            In Queue
          </p>
        </div>
        <div className="w-px h-8 bg-gray-100" aria-hidden="true" />
        <div className="flex-1 text-center">
          <p
            className="text-2xl font-bold text-[#2563EB]"
            aria-label={`Average consultation time: ${doctor.avgConsultMinutes} minutes`}
          >
            {formatMinutes(doctor.avgConsultMinutes)}
          </p>
          <p className="text-xs text-gray-400 font-medium mt-0.5 tracking-wider uppercase">
            Avg Time
          </p>
        </div>
      </div>
    </article>
  );
});

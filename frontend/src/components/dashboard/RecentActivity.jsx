import { useEffect, useState } from "react";

function getRelativeTime(date, now) {
  const timestamp = new Date(date).getTime();

  if (Number.isNaN(timestamp)) return "";

  const difference = Math.max(0, now - timestamp);

  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  if (days < 7) return `${days} days ago`;

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function RecentActivity({ activities }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_40px_-12px_rgba(0,0,0,0.12)] ring-1 ring-neutral-900/[0.06]">
      <div className="border-b border-neutral-100 px-6 py-5 sm:px-7">
        <h3 className="text-[15px] font-semibold tracking-tight text-neutral-900">
          Recent activity
        </h3>

        <p className="mt-1 text-xs text-neutral-500">
          Latest workspace events
        </p>
      </div>

      <div className="divide-y divide-neutral-100 px-6 sm:px-7">
        {activities.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm font-medium text-neutral-900">
              No recent activity found.
            </p>
            <p className="mt-1.5 text-sm text-neutral-500">
              Workspace events will appear here as they happen.
            </p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 py-4 transition-colors"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-semibold text-white">
                {activity.initials}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-neutral-900">
                  {activity.title}
                </p>

                <p className="mt-0.5 text-xs text-neutral-500">
                  {activity.detail}
                </p>
              </div>

              <span className="shrink-0 pt-0.5 text-xs text-neutral-400">
                {getRelativeTime(activity.createdAt, now)}
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default RecentActivity;
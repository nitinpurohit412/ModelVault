function StatCard({ title, value, description, icon: Icon }) {
  return (
    <div className="group rounded-3xl bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_40px_-12px_rgba(0,0,0,0.12)] ring-1 ring-neutral-900/[0.06] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_20px_48px_-12px_rgba(0,0,0,0.18)]">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-neutral-500">
          {title}
        </p>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700 transition group-hover:bg-neutral-900 group-hover:text-white">
          <Icon size={19} strokeWidth={1.8} />
        </div>
      </div>

      <p className="mt-5 text-3xl font-semibold tracking-tight text-neutral-900">
        {value}
      </p>

      <p className="mt-1.5 text-xs text-neutral-500">
        {description}
      </p>
    </div>
  );
}

export default StatCard;
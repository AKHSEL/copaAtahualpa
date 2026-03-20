type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  size?: "sm" | "md";
};

export function SectionHeader({ title, subtitle, size = "md" }: SectionHeaderProps) {
  const titleClass =
    size === "sm"
      ? "text-base md:text-lg"
      : "text-lg md:text-xl";

  return (
    <div className="flex flex-col gap-1">
      <h2 className={`${titleClass} font-bold tracking-tight text-[var(--brand-navy)]`}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-xs text-[var(--text-muted)] md:text-sm">{subtitle}</p>
      )}
    </div>
  );
}


type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
};

export function SectionHeading({ eyebrow, title, action }: SectionHeadingProps) {
  return (
    <div className={`mb-8 ${action ? "grid gap-6 md:flex md:items-end md:justify-between" : "max-w-3xl"}`}>
      <div>
        <p className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.12em] text-doxa-crimson">{eyebrow}</p>
        <h2 className="font-display text-[32px] font-bold leading-[1.02] text-doxa-noir md:text-[44px] lg:text-[54px]">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

import Link from "next/link";

type VariantNavigationProps = {
  activeVariantId: string;
  variants: Array<{ id: string; label: string }>;
};

export function VariantNavigation({
  activeVariantId,
  variants,
}: VariantNavigationProps) {
  return (
    <nav className="variant-nav" aria-label="CV variants">
      <span className="variant-nav__label">CV variant</span>
      <div className="variant-nav__links">
        {variants.map(({ id, label }) => (
          <Link
            key={id}
            href={`/cv/${id}`}
            aria-current={id === activeVariantId ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

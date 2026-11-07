import Link from "next/link";

type Props = {
  tenantSlug: string;
  tenantName: string;
  title: string;
  children: React.ReactNode;
};

export default function LegalPage({ tenantSlug, tenantName, title, children }: Props) {
  const basePath = `/r/${tenantSlug}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="bg-foreground py-4">
        <div className="max-w-[800px] mx-auto px-5">
          <Link href={basePath} className="text-white text-sm hover:text-white/80 transition-colors">← Zurück</Link>
        </div>
      </nav>
      <main className="max-w-[800px] mx-auto px-5 py-16">
        <h1 className="font-display text-4xl text-foreground mb-10">{title}</h1>
        <div className="space-y-6 text-sm text-muted leading-relaxed">
          {children}
        </div>
      </main>
      <footer className="border-t border-border py-10">
        <div className="max-w-[800px] mx-auto px-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted/50">
          <p>© {new Date().getFullYear()} {tenantName}</p>
          <div className="flex gap-6">
            <Link href={`${basePath}/impressum`} className="hover:text-foreground transition-colors">Impressum</Link>
            <Link href={`${basePath}/datenschutz`} className="hover:text-foreground transition-colors">Datenschutz</Link>
            <Link href={`${basePath}/agb`} className="hover:text-foreground transition-colors">AGB</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

import Link from "next/link";

export function Footer() {
    const letters = ["All", "0-9", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];

    return (
        <footer className="mt-16 border-t border-border bg-surface pt-10 pb-6">
            <div className="container mx-auto px-4">
                {/* A-Z Section */}
                <div className="mb-10">
                    <h3 className="mb-2 text-lg font-bold text-primary">A-Z List</h3>
                    <p className="mb-4 text-sm text-text-muted">Searching Manga order by alphabet name A to Z.</p>
                    <div className="flex flex-wrap gap-2">
                        {letters.map((char) => (
                            <Link
                                key={char}
                                href={`/manga-list?char=${char}`}
                                className="flex items-center justify-center rounded bg-background px-2 py-1 text-xs font-semibold text-text-muted hover:bg-primary hover:text-white transition-colors border border-border"
                            >
                                {char}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Footer Links Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
                    <FooterColumn title="Help">
                        <FooterLink href="/contact">Contact</FooterLink>
                        <FooterLink href="/privacy">Privacy Policy</FooterLink>
                        <FooterLink href="/tos">TOS</FooterLink>
                        <FooterLink href="/dmca">DMCA</FooterLink>
                    </FooterColumn>

                    <FooterColumn title="Links">
                        <FooterLink href="/newest">Newest</FooterLink>
                        <FooterLink href="/updated">Recently Updated</FooterLink>
                        <FooterLink href="/popular">Popular</FooterLink>
                        <FooterLink href="/manga-list">A-Z List</FooterLink>
                    </FooterColumn>

                    <FooterColumn title="Partners">
                        <a href="#" className="text-text-muted hover:text-primary transition-colors block py-1">Read novel online</a>
                    </FooterColumn>

                    <div className="flex flex-col justify-start">
                        <div className="mt-auto">
                            <p className="text-xs text-text-muted leading-relaxed">
                                All Manga, Character Designs and Logos are © to their respective copyright holders.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col">
            <h4 className="mb-4 text-base font-bold text-white uppercase tracking-wider">{title}</h4>
            <ul className="flex flex-col gap-1">
                {children}
            </ul>
        </div>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <li>
            <Link href={href} className="text-text-muted hover:text-primary transition-colors block py-1">
                {children}
            </Link>
        </li>
    );
}

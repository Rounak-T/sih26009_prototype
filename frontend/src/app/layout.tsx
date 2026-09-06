import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Manganese Intelligence Platform",
  description: "SIH26009 Prototype",
};

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/map", label: "Prospectivity Map" },
  { href: "/production", label: "Production" },
  { href: "/risk", label: "Risk Analysis" },
  { href: "/recommendations", label: "Recommendations" },
  { href: "/upload", label: "Upload Data" },
  { href: "/predict", label: "Predict" },
  { href: "/about", label: "About" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex h-screen bg-gray-50">
        <aside className="w-56 bg-slate-900 text-white flex flex-col p-4 space-y-2">
          <h2 className="text-lg font-bold mb-4"></h2>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 rounded hover:bg-slate-700 text-sm"
            >
              {item.label}
            </Link>
          ))}
        </aside>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </body>
    </html>
  );
}
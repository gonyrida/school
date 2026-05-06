import { Link } from "react-router-dom";
import { Plus, Search, Edit3, Trash2, FileText } from "lucide-react";

type Props = {
  title: string;
  description?: string;
  itemLabel?: string;
};

const SAMPLE = [
  { id: 1, title: "Annual Science Fair 2025", category: "Academy", status: "Published", date: "2025-10-12" },
  { id: 2, title: "Inter-house Sports Day", category: "Sports", status: "Draft", date: "2025-11-04" },
  { id: 3, title: "Annual Art Exhibition", category: "Arts", status: "Published", date: "2025-11-22" },
  { id: 4, title: "Community Service Day", category: "Community", status: "Published", date: "2025-12-08" },
];

export default function AdminListPage({
  title,
  description = "Manage and update content for this section. All edits sync to the public website immediately.",
  itemLabel = "Item",
}: Props) {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">{title}</h1>
          <p className="text-sm text-ink-500 mt-1 max-w-2xl">{description}</p>
        </div>
        <button className="btn-primary">
          <Plus className="h-4 w-4" /> Add {itemLabel}
        </button>
      </header>

      <div className="card p-5">
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-300" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-full bg-surface-muted border-0 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700/30"
            />
          </div>
          <select className="bg-surface-muted border-0 rounded-full text-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-brand-700/30">
            <option>All categories</option>
            <option>Academy</option>
            <option>Sports</option>
            <option>Arts</option>
            <option>Community</option>
          </select>
          <select className="bg-surface-muted border-0 rounded-full text-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-brand-700/30">
            <option>All status</option>
            <option>Published</option>
            <option>Draft</option>
          </select>
        </div>

        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-ink-500 border-b border-ink-300/10">
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE.map((row) => (
                <tr key={row.id} className="border-b border-ink-300/5 hover:bg-surface-muted/40 transition">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg checker-bg shrink-0" />
                      <span className="font-medium text-ink-900">{row.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-ink-700">{row.category}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                        row.status === "Published"
                          ? "bg-accent-green/10 text-accent-green"
                          : "bg-accent-gold/10 text-accent-gold"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          row.status === "Published" ? "bg-accent-green" : "bg-accent-gold"
                        }`}
                      />
                      {row.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-ink-500">{row.date}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 rounded-lg hover:bg-surface-muted text-ink-500 hover:text-brand-700">
                        <FileText className="h-4 w-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-surface-muted text-ink-500 hover:text-brand-700">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-surface-muted text-ink-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between pt-4 mt-4 border-t border-ink-300/10">
          <p className="text-xs text-ink-500">Showing 1–4 of 4</p>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 rounded-lg text-sm hover:bg-surface-muted disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-1.5 rounded-lg text-sm bg-brand-700 text-white">1</button>
            <button className="px-3 py-1.5 rounded-lg text-sm hover:bg-surface-muted disabled:opacity-50" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

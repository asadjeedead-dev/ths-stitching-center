import React, { useState } from 'react';
import { ContactInquiry, InquiryStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { ConfirmModal } from '../common/ConfirmModal';
import {
  Search,
  Phone,
  MapPin,
  Eye,
  X,
  Trash2,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react';

interface InquiriesViewProps {
  inquiries: ContactInquiry[];
  onUpdateStatus: (id: string, status: InquiryStatus) => void;
  onDeleteInquiry: (id: string) => void;
}

function digitsForWhatsApp(phone: string): string {
  let digits = (phone || '').replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.startsWith('0')) digits = `92${digits.slice(1)}`;
  return digits;
}

export const InquiriesView: React.FC<InquiriesViewProps> = ({
  inquiries,
  onUpdateStatus,
  onDeleteInquiry,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewingInquiry, setViewingInquiry] = useState<ContactInquiry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = inquiries.filter((item) => {
    const haystack = `${item.name} ${item.phone} ${item.area} ${item.message}`.toLowerCase();
    const matchesSearch = haystack.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, phone, area, or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#166534] outline-none bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {['all', 'New', 'Contacted', 'Closed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  statusFilter === status
                    ? 'bg-[#166534] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {status === 'all' ? 'All Messages' : status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="pb-3.5 font-semibold">Sender</th>
                <th className="pb-3.5 font-semibold">Phone</th>
                <th className="pb-3.5 font-semibold">Area</th>
                <th className="pb-3.5 font-semibold">Message</th>
                <th className="pb-3.5 font-semibold">Received</th>
                <th className="pb-3.5 font-semibold">Status</th>
                <th className="pb-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-4">
                    <div className="font-bold text-slate-900">{item.name}</div>
                  </td>
                  <td className="py-4 text-xs">
                    <div className="font-bold text-slate-800">{item.phone}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <a
                        href={`tel:${item.phone}`}
                        className="text-[#166534] font-semibold hover:underline"
                      >
                        Call
                      </a>
                      <a
                        href={`https://wa.me/${digitsForWhatsApp(item.phone)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-700 font-semibold hover:underline"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </td>
                  <td className="py-4 text-xs text-slate-600">{item.area || '—'}</td>
                  <td className="py-4 text-xs text-slate-700 max-w-xs">
                    <p className="line-clamp-2">{item.message || 'No message written.'}</p>
                  </td>
                  <td className="py-4 text-xs text-slate-500 whitespace-nowrap">
                    {new Date(item.submittedAt).toLocaleString()}
                  </td>
                  <td className="py-4">
                    <StatusBadge status={item.status} size="sm" />
                  </td>
                  <td className="py-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => setViewingInquiry(item)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-[#166534] hover:bg-emerald-50 transition"
                        title="View full message"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {item.status === 'New' && (
                        <button
                          onClick={() => onUpdateStatus(item.id, 'Contacted')}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-white bg-[#166534] hover:bg-[#14532d]"
                        >
                          Mark Contacted
                        </button>
                      )}
                      {item.status === 'Contacted' && (
                        <button
                          onClick={() => onUpdateStatus(item.id, 'Closed')}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
                        >
                          Close
                        </button>
                      )}
                      <button
                        onClick={() => setDeletingId(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete message"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-sm">
                    {inquiries.length === 0
                      ? 'No contact messages yet. When a visitor submits the public contact form, it will appear here.'
                      : 'No messages match this search.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {viewingInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setViewingInquiry(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 pr-8">
                <div>
                  <span className="text-xs font-bold text-[#166534]">Website Contact Message</span>
                  <h3 className="text-xl font-bold font-serif text-slate-900">{viewingInquiry.name}</h3>
                </div>
                <StatusBadge status={viewingInquiry.status} size="sm" />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50">
                  <div className="text-slate-400 font-medium flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    Phone / WhatsApp
                  </div>
                  <div className="font-bold text-slate-900 mt-1">{viewingInquiry.phone}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <div className="text-slate-400 font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Area
                  </div>
                  <div className="font-bold text-slate-900 mt-1">{viewingInquiry.area || 'Not provided'}</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900">
                <span className="font-bold flex items-center gap-1 mb-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Message
                </span>
                {viewingInquiry.message || 'No written message.'}
              </div>

              <p className="text-[11px] text-slate-400">
                Received {new Date(viewingInquiry.submittedAt).toLocaleString()}
              </p>

              <div className="pt-3 flex flex-wrap items-center justify-end gap-2 border-t border-slate-100">
                <a
                  href={`tel:${viewingInquiry.phone}`}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Call
                </a>
                <a
                  href={`https://wa.me/${digitsForWhatsApp(viewingInquiry.phone)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#166534] hover:bg-[#14532d] rounded-xl"
                >
                  WhatsApp
                </a>
                {viewingInquiry.status === 'New' && (
                  <button
                    onClick={() => {
                      onUpdateStatus(viewingInquiry.id, 'Contacted');
                      setViewingInquiry({ ...viewingInquiry, status: 'Contacted' });
                    }}
                    className="inline-flex items-center gap-1 px-4 py-2 text-xs font-bold text-white bg-sky-700 hover:bg-sky-800 rounded-xl"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Mark Contacted
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deletingId)}
        title="Delete Message"
        message="Remove this contact message from Firebase? This cannot be undone."
        confirmLabel="Delete Message"
        isDestructive
        onConfirm={() => {
          if (deletingId) {
            onDeleteInquiry(deletingId);
            setDeletingId(null);
          }
        }}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { StitchingOrder, Student, OrderStatus, LateReason } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { ConfirmModal } from '../common/ConfirmModal';
import { 
  Search, 
  Plus, 
  Scissors, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Phone, 
  DollarSign, 
  Edit2, 
  Trash2, 
  Eye, 
  X, 
  Calendar, 
  FileText,
  UserCheck
} from 'lucide-react';

interface OrdersViewProps {
  orders: StitchingOrder[];
  students: Student[];
  onSaveOrder: (order: Omit<StitchingOrder, 'id'> & { id?: string }) => void | Promise<void>;
  onDeleteOrder: (id: string) => void | Promise<void>;
  isAddModalOpen?: boolean;
  onCloseAddModal?: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  students,
  onSaveOrder,
  onDeleteOrder,
  isAddModalOpen = false,
  onCloseAddModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [assignedFilter, setAssignedFilter] = useState<string>('all');
  const [deliveryFilter, setDeliveryFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [formError, setFormError] = useState('');
  const [deliveryError, setDeliveryError] = useState('');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<StitchingOrder | null>(null);
  const [viewingOrder, setViewingOrder] = useState<StitchingOrder | null>(null);
  const [deliveringOrder, setDeliveringOrder] = useState<StitchingOrder | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);

  // Delivery Modal State
  const [actualDeliveryDateInput, setActualDeliveryDateInput] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [deliveryLateReason, setDeliveryLateReason] = useState<LateReason | string>(
    'Customer Requested Design Change'
  );
  const [deliveryCustomLateReason, setDeliveryCustomLateReason] = useState('');

  // Form State
  const [formData, setFormData] = useState<Partial<StitchingOrder>>({
    customerName: '',
    customerPhone: '',
    garmentType: 'Party Frock (Organza Layered)',
    quantity: 1,
    receivedDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
    status: 'In Progress',
    stitchingCharges: 4500,
    advancePaid: 2000,
    balanceDue: 2500,
    assignedStudentId: '',
    assignedStudentName: '',
    specialInstructions: '',
    lateDeliveryReason: '',
    customLateReason: '',
    measurements: {
      chest: '',
      waist: '',
      hip: '',
      length: '',
      shoulder: '',
      sleeves: '',
      trouserLength: '',
      notes: '',
    },
  });

  // Sync external add trigger
  React.useEffect(() => {
    if (isAddModalOpen) {
      handleOpenCreate();
    }
  }, [isAddModalOpen]);

  // Calculations
  const activeOrders = orders.filter((o) => o.status !== 'Delivered');
  const completedOrders = orders.filter((o) => o.status === 'Delivered');
  const lateOrders = orders.filter((o) => o.status === 'Late' || o.isLate);
  const totalRevenue = orders.reduce((sum, o) => sum + (o.stitchingCharges || 0), 0);
  const totalReceivables = orders.reduce((sum, o) => sum + (o.balanceDue || 0), 0);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.garmentType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'Late'
        ? order.status === 'Late' || Boolean(order.isLate)
        : statusFilter === 'Ready for Pickup'
        ? order.status === 'Ready for Pickup' || order.status === 'Ready'
        : order.status === statusFilter;

    const matchesAssigned =
      assignedFilter === 'all' || order.assignedStudentId === assignedFilter;

    const matchesDelivery =
      deliveryFilter === 'all'
        ? true
        : deliveryFilter === 'late'
        ? Boolean(order.isLate) || order.status === 'Late' || (order.lateDays || 0) > 0
        : deliveryFilter === 'ontime'
        ? order.status === 'Delivered' && !order.isLate && !(order.lateDays && order.lateDays > 0)
        : true;

    const matchesDate =
      (!dateFrom || order.expectedDeliveryDate >= dateFrom) &&
      (!dateTo || order.expectedDeliveryDate <= dateTo);

    return matchesSearch && matchesStatus && matchesAssigned && matchesDelivery && matchesDate;
  });

  const handleOpenCreate = () => {
    setEditingOrder(null);
    setFormData({
      customerName: '',
      customerPhone: '',
      garmentType: '3-Piece Shalwar Kameez',
      quantity: 1,
      receivedDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
      status: 'Received',
      stitchingCharges: 4000,
      advancePaid: 2000,
      balanceDue: 2000,
      assignedStudentId: students[0]?.id || '',
      assignedStudentName: students[0]?.name || '',
      specialInstructions: '',
      measurements: {
        chest: '36 in',
        waist: '29 in',
        length: '40 in',
        shoulder: '14 in',
        sleeves: '20 in',
        trouserLength: '38 in',
      },
    });
    setFormError('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (order: StitchingOrder) => {
    setEditingOrder(order);
    setFormData(order);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingOrder(null);
    if (onCloseAddModal) onCloseAddModal();
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.customerName?.trim() || !formData.customerPhone?.trim() || !formData.garmentType?.trim()) {
      setFormError('Please fill in all required fields.');
      return;
    }

    const duplicateOrder = formData.orderNumber?.trim()
      && orders.some(
        (order) =>
          order.orderNumber.trim().toLowerCase() === formData.orderNumber!.trim().toLowerCase() &&
          order.id !== editingOrder?.id
      );
    if (duplicateOrder) {
      setFormError('Duplicate Order ID. Please use a unique ID.');
      return;
    }

    if (formData.expectedDeliveryDate && formData.receivedDate && formData.expectedDeliveryDate < formData.receivedDate) {
      setFormError('Expected delivery date cannot be before the received date.');
      return;
    }

    if (formData.actualDeliveryDate && formData.receivedDate && formData.actualDeliveryDate < formData.receivedDate) {
      setFormError('Actual delivery date cannot be before the received date.');
      return;
    }

    const assigned = students.find((s) => s.id === formData.assignedStudentId);
    const charges = Number(formData.stitchingCharges) || 0;
    const advance = Number(formData.advancePaid) || 0;
    const balance = Math.max(0, charges - advance);
    const status = (formData.status as OrderStatus) || 'Received';

    if (status === 'Late' && !formData.lateDeliveryReason) {
      setFormError('A late delivery reason is required for late orders.');
      return;
    }

    if (formData.lateDeliveryReason === 'Other' && !formData.customLateReason?.trim()) {
      setFormError('Please enter a custom late reason.');
      return;
    }

    try {
      await onSaveOrder({
      ...(editingOrder ? { id: editingOrder.id, orderNumber: editingOrder.orderNumber } : {}),
      orderNumber: formData.orderNumber,
      customerName: formData.customerName || '',
      customerPhone: formData.customerPhone || '',
      garmentType: formData.garmentType || 'Shalwar Kameez',
      quantity: Number(formData.quantity) || 1,
      receivedDate: formData.receivedDate || new Date().toISOString().split('T')[0],
      expectedDeliveryDate: formData.expectedDeliveryDate || new Date().toISOString().split('T')[0],
      actualDeliveryDate: formData.actualDeliveryDate,
      status,
      stitchingCharges: charges,
      advancePaid: advance,
      balanceDue: balance,
      assignedStudentId: formData.assignedStudentId,
      assignedStudentName: assigned ? assigned.name : formData.assignedStudentName || 'Unassigned',
      specialInstructions: formData.specialInstructions || '',
      lateDeliveryReason: formData.lateDeliveryReason,
      customLateReason: formData.customLateReason,
      measurements: formData.measurements,
      });
      handleCloseForm();
    } catch {
      setFormError('Could not save this order to Firebase. Please try again.');
    }
  };

  // Mark As Delivered Action & Late Reason capture
  const handleOpenDeliverModal = (order: StitchingOrder) => {
    setDeliveringOrder(order);
    setActualDeliveryDateInput(new Date().toISOString().split('T')[0]);
    setDeliveryLateReason(order.lateDeliveryReason || 'Customer Requested Design Change');
    setDeliveryCustomLateReason(order.customLateReason || '');
    setDeliveryError('');
  };

  const handleConfirmDelivered = async () => {
    if (!deliveringOrder) return;
    setDeliveryError('');

    if (actualDeliveryDateInput < deliveringOrder.receivedDate) {
      setDeliveryError('Actual delivery date cannot be before the received date.');
      return;
    }

    const expectedDate = new Date(`${deliveringOrder.expectedDeliveryDate}T00:00:00`);
    const deliveredDate = new Date(`${actualDeliveryDateInput}T00:00:00`);
    const diffTime = deliveredDate.getTime() - expectedDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    const isLateDelivery = diffDays > 0;

    if (isLateDelivery && !deliveryLateReason) {
      setDeliveryError('A late delivery reason is required.');
      return;
    }

    if (isLateDelivery && deliveryLateReason === 'Other' && !deliveryCustomLateReason.trim()) {
      setDeliveryError('Please enter a custom late reason.');
      return;
    }

    try {
      await onSaveOrder({
      ...deliveringOrder,
      status: 'Delivered',
      actualDeliveryDate: actualDeliveryDateInput,
      balanceDue: 0,
      advancePaid: deliveringOrder.stitchingCharges,
      isLate: isLateDelivery,
      lateDays: Math.max(0, diffDays),
      lateDeliveryReason: isLateDelivery ? deliveryLateReason : undefined,
      customLateReason: isLateDelivery && deliveryLateReason === 'Other' ? deliveryCustomLateReason : (isLateDelivery ? deliveryCustomLateReason : undefined),
      });
      setDeliveringOrder(null);
    } catch {
      setDeliveryError('Could not save this delivery to Firebase. Please try again.');
    }
  };

  const lateReasonsList: LateReason[] = [
    'Customer Requested Design Change',
    'Fabric Issue',
    'Embroidery Delay',
    'Heavy Workload',
    'Machine Issue',
    'Worker Unavailable',
    'Other'
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top 4 Metrics Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Queue</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Scissors className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-serif text-slate-900">{activeOrders.length}</div>
          <div className="text-xs text-slate-500 mt-1">Garments in production</div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Overdue / Late</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-serif text-rose-600">{lateOrders.length}</div>
          <div className="text-xs text-rose-700/80 font-medium mt-1">Requires immediate attention</div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Delivered Orders</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-serif text-[#166534]">{completedOrders.length}</div>
          <div className="text-xs text-slate-500 mt-1">Completed & dispatched</div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Order Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-slate-900">
            PKR {totalRevenue.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Receivables: <strong className="text-rose-600">PKR {totalReceivables.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Status Tabs & New Order Button */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by order ID (#ORD-2094), customer name, phone, or garment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#166534] outline-none bg-slate-50/50"
            />
          </div>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#166534] hover:bg-[#14532d] rounded-xl shadow-xs transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Stitching Order</span>
          </button>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
            Status:
          </span>

          {[
            { id: 'all', label: 'All Orders' },
            { id: 'Received', label: 'Received' },
            { id: 'In Progress', label: 'In Progress' },
            { id: 'Ready for Pickup', label: 'Ready' },
            { id: 'Delivered', label: 'Delivered' },
            { id: 'Late', label: 'Late / Overdue' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                statusFilter === tab.id
                  ? 'bg-[#166534] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}

          <select
            value={deliveryFilter}
            onChange={(e) => setDeliveryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 outline-none"
          >
            <option value="all">All Delivery Status</option>
            <option value="ontime">On Time</option>
            <option value="late">Late</option>
          </select>

          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 outline-none"
            title="Expected date from"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 outline-none"
            title="Expected date to"
          />

          {/* Worker filter */}
          <div className="ml-auto flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500">Assigned:</span>
            <select
              value={assignedFilter}
              onChange={(e) => setAssignedFilter(e.target.value)}
              className="px-3 py-1 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 outline-none"
            >
              <option value="all">All Trainees</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.studentId})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="pb-3.5 font-semibold">Order ID</th>
                <th className="pb-3.5 font-semibold">Customer & Contact</th>
                <th className="pb-3.5 font-semibold">Garment & Qty</th>
                <th className="pb-3.5 font-semibold">Assigned Trainee</th>
                <th className="pb-3.5 font-semibold">Expected Due</th>
                <th className="pb-3.5 font-semibold">Status & Late Delay</th>
                <th className="pb-3.5 font-semibold text-right">Charges / Balance</th>
                <th className="pb-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/70 transition">
                  {/* Order Number */}
                  <td className="py-4 font-bold text-[#166534]">
                    {order.orderNumber}
                  </td>

                  {/* Customer */}
                  <td className="py-4 text-xs">
                    <div className="font-bold text-slate-900">{order.customerName}</div>
                    <a
                      href={`tel:${order.customerPhone}`}
                      className="text-slate-500 hover:text-[#166534] inline-flex items-center gap-1 mt-0.5"
                    >
                      <Phone className="w-3 h-3 text-[#166534]" />
                      <span>{order.customerPhone}</span>
                    </a>
                  </td>

                  {/* Garment */}
                  <td className="py-4 text-xs">
                    <div className="font-bold text-slate-800">{order.garmentType}</div>
                    <div className="text-slate-400">Qty: {order.quantity} pc(s)</div>
                  </td>

                  {/* Assigned Trainee */}
                  <td className="py-4 text-xs text-slate-700">
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100 font-medium">
                      <UserCheck className="w-3.5 h-3.5 text-[#166534]" />
                      <span>{order.assignedStudentName || 'Unassigned'}</span>
                    </div>
                  </td>

                  {/* Expected Due */}
                  <td className="py-4 text-xs text-slate-700">
                    <div className="font-medium">{order.expectedDeliveryDate}</div>
                    <div className="text-[10px] text-slate-400">Recv: {order.receivedDate}</div>
                  </td>

                  {/* Status & Late Tracking Reason */}
                  <td className="py-4">
                    <div className="space-y-1">
                      <StatusBadge status={order.status} size="sm" lateDays={order.lateDays} isLate={order.isLate} />
                      {order.status === 'Delivered' && (order.isLate || (order.lateDays || 0) > 0) && (
                        <div className="text-[10px] font-semibold text-rose-700">
                          ⚠ Late by {order.lateDays || 0} day{(order.lateDays || 0) === 1 ? '' : 's'}
                        </div>
                      )}
                      {order.status === 'Delivered' && !order.isLate && !(order.lateDays && order.lateDays > 0) && (
                        <div className="text-[10px] font-semibold text-emerald-700">
                          ✓ Delivered On Time
                        </div>
                      )}
                      {order.lateDeliveryReason && (
                        <div className="text-[10px] font-semibold text-rose-700 truncate max-w-xs" title={order.lateDeliveryReason}>
                          ⚠️ {order.lateDeliveryReason}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Charges */}
                  <td className="py-4 text-right text-xs">
                    <div className="font-bold text-slate-900">
                      PKR {order.stitchingCharges.toLocaleString()}
                    </div>
                    {order.balanceDue > 0 ? (
                      <div className="text-[11px] font-semibold text-rose-600">
                        Due: PKR {order.balanceDue.toLocaleString()}
                      </div>
                    ) : (
                      <div className="text-[11px] font-semibold text-emerald-600">
                        Fully Paid
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      {order.status !== 'Delivered' && (
                        <button
                          onClick={() => handleOpenDeliverModal(order)}
                          className="px-2.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition"
                          title="Mark Delivered & Collect Balance"
                        >
                          Deliver
                        </button>
                      )}
                      <button
                        onClick={() => setViewingOrder(order)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-[#166534] hover:bg-emerald-50 transition"
                        title="View Measurements & Instructions"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(order)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition"
                        title="Edit Order"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingOrderId(order.id)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete Order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    {orders.length === 0 ? (
                      <div className="space-y-3">
                        <p className="text-slate-500 text-sm">No stitching orders found.</p>
                        <button
                          onClick={handleOpenCreate}
                          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#166534] hover:bg-[#14532d] rounded-xl"
                        >
                          Create New Order
                        </button>
                      </div>
                    ) : (
                      <p className="text-slate-500 text-sm">No stitching orders match the selected filters.</p>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Order Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8 animate-in fade-in zoom-in-95">
            <button
              onClick={handleCloseForm}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div>
                <h3 className="text-xl font-bold font-serif text-[#0b1c30]">
                  {editingOrder ? `Edit Order: ${editingOrder.orderNumber}` : 'Create New Stitching Order'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Record customer garment requirements, assigned trainee worker, and scheduled due date.
                </p>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Order ID
                </label>
                <input
                  type="text"
                  value={formData.orderNumber || ''}
                  onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                  placeholder="Auto-generated if left blank (e.g. #ORD-2096)"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#166534] outline-none"
                />
              </div>

              {/* Customer & Garment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Customer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="e.g. Mrs. Tahira Jameel"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#166534] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Customer Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    placeholder="+92 300 9876543"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#166534] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Garment Silhouette / Type *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.garmentType}
                    onChange={(e) => setFormData({ ...formData, garmentType: e.target.value })}
                    placeholder="e.g. Bridal Lehnga & Choli / Party Frock / Lawn Suit"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#166534] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#166534] outline-none"
                  />
                </div>
              </div>

              {/* Dates & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Received Date
                  </label>
                  <input
                    type="date"
                    value={formData.receivedDate}
                    onChange={(e) => setFormData({ ...formData, receivedDate: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#166534] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Expected Delivery Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.expectedDeliveryDate}
                    onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#166534] outline-none font-bold text-[#166534]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Order Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as OrderStatus })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#166534] outline-none"
                  >
                    <option value="Received">Received</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Ready">Ready</option>
                    <option value="Ready for Pickup">Ready for Pickup</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Late">Late / Overdue</option>
                  </select>
                </div>
              </div>

              {/* Assigned Trainee Worker & Late Reason */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Assigned Trainee / Tailor
                  </label>
                  <select
                    value={formData.assignedStudentId}
                    onChange={(e) => setFormData({ ...formData, assignedStudentId: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#166534] outline-none"
                  >
                    <option value="">Unassigned</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.course} - {s.session})
                      </option>
                    ))}
                  </select>
                </div>

                {/* If Late: Late Delivery Reason */}
                {(formData.status === 'Late' || editingOrder?.isLate) && (
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-rose-700 mb-1">
                      Late Delivery Reason *
                    </label>
                    <select
                      value={formData.lateDeliveryReason}
                      onChange={(e) => setFormData({ ...formData, lateDeliveryReason: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-rose-300 text-sm focus:ring-2 focus:ring-rose-500 outline-none bg-rose-50"
                    >
                      {lateReasonsList.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                    {formData.lateDeliveryReason === 'Other' && (
                      <input
                        type="text"
                        value={formData.customLateReason || ''}
                        onChange={(e) => setFormData({ ...formData, customLateReason: e.target.value })}
                        placeholder="Enter custom late reason"
                        className="w-full px-3 py-2.5 rounded-xl border border-rose-300 text-sm outline-none bg-rose-50"
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Charges & Advance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Stitching Charges (PKR) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.stitchingCharges}
                    onChange={(e) => setFormData({ ...formData, stitchingCharges: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#166534] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Advance Payment Paid (PKR)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.advancePaid}
                    onChange={(e) => setFormData({ ...formData, advancePaid: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#166534] outline-none"
                  />
                </div>
              </div>

              {/* Special Instructions & Measurements */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Design Instructions & Finishing Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.specialInstructions}
                  onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                  placeholder="e.g. Can-can net flare, matching piping on neck, loop buttons on sleeves..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#166534] outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold text-white bg-[#166534] hover:bg-[#14532d] rounded-xl shadow-xs transition"
                >
                  {editingOrder ? 'Update Order' : 'Save Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deliver Order & Verify Late Delay Modal */}
      {deliveringOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setDeliveringOrder(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#166534] flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-serif text-slate-900">
                    Dispatch / Deliver Order
                  </h3>
                  <p className="text-xs text-slate-500">
                    {deliveringOrder.orderNumber} — {deliveringOrder.customerName}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Expected Delivery Date:</span>
                  <span className="font-bold text-slate-900">{deliveringOrder.expectedDeliveryDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Garment Type:</span>
                  <span className="font-bold text-slate-900">{deliveringOrder.garmentType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Remaining Balance to Collect:</span>
                  <span className="font-bold text-rose-600">PKR {deliveringOrder.balanceDue.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Actual Delivery Date *
                </label>
                <input
                  type="date"
                  required
                  value={actualDeliveryDateInput}
                  onChange={(e) => setActualDeliveryDateInput(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#166534] outline-none"
                />
              </div>

              {deliveryError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
                  {deliveryError}
                </div>
              )}

              {/* Late Delivery Reason prompt if actual > expected */}
              {actualDeliveryDateInput > deliveringOrder.expectedDeliveryDate && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-3 animate-in fade-in">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>
                      Late by {Math.max(0, Math.round((new Date(`${actualDeliveryDateInput}T00:00:00`).getTime() - new Date(`${deliveringOrder.expectedDeliveryDate}T00:00:00`).getTime()) / 86400000))} day(s) — reason required
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-rose-900 mb-1">
                      Select Primary Cause:
                    </label>
                    <select
                      value={deliveryLateReason}
                      onChange={(e) => setDeliveryLateReason(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-rose-300 bg-white text-xs font-medium text-rose-900 outline-none"
                    >
                      {lateReasonsList.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  {deliveryLateReason === 'Other' && (
                    <div>
                      <label className="block text-[11px] font-bold text-rose-900 mb-1">
                        Custom Reason:
                      </label>
                      <input
                        type="text"
                        value={deliveryCustomLateReason}
                        onChange={(e) => setDeliveryCustomLateReason(e.target.value)}
                        placeholder="Enter the custom late reason"
                        className="w-full px-3 py-2 rounded-xl border border-rose-300 bg-white text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDeliveringOrder(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelivered}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-[#166534] hover:bg-[#14532d] rounded-xl shadow-xs"
                >
                  Confirm Delivery & Mark Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Order Slip Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setViewingOrder(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-[#166534]">{viewingOrder.orderNumber}</span>
                  <h3 className="text-xl font-bold font-serif text-slate-900">{viewingOrder.garmentType}</h3>
                </div>
                <StatusBadge status={viewingOrder.status} size="sm" lateDays={viewingOrder.lateDays} isLate={viewingOrder.isLate} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50">
                  <div className="text-slate-400 font-medium">Customer:</div>
                  <div className="font-bold text-slate-900">{viewingOrder.customerName}</div>
                  <div className="text-slate-600">{viewingOrder.customerPhone}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <div className="text-slate-400 font-medium">Assigned Worker:</div>
                  <div className="font-bold text-[#166534]">{viewingOrder.assignedStudentName || 'Unassigned'}</div>
                  <div className="text-slate-600">Expected: {viewingOrder.expectedDeliveryDate}</div>
                </div>
              </div>

              {/* Measurements */}
              {viewingOrder.measurements && (
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 text-xs">
                  <div className="font-bold text-[#166534] uppercase tracking-wider mb-2">
                    Client Measurements
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-slate-700">
                    <div>Chest: <strong>{viewingOrder.measurements.chest || '—'}</strong></div>
                    <div>Waist: <strong>{viewingOrder.measurements.waist || '—'}</strong></div>
                    <div>Length: <strong>{viewingOrder.measurements.length || '—'}</strong></div>
                    <div>Shoulder: <strong>{viewingOrder.measurements.shoulder || '—'}</strong></div>
                    <div>Sleeves: <strong>{viewingOrder.measurements.sleeves || '—'}</strong></div>
                    <div>Trouser: <strong>{viewingOrder.measurements.trouserLength || '—'}</strong></div>
                  </div>
                </div>
              )}

              {viewingOrder.specialInstructions && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  <span className="font-bold block mb-1">Design & Styling Instructions:</span>
                  {viewingOrder.specialInstructions}
                </div>
              )}

              {viewingOrder.actualDeliveryDate && (
                <div className={`p-3.5 rounded-xl text-xs ${viewingOrder.isLate || (viewingOrder.lateDays || 0) > 0 ? 'bg-rose-50 border border-rose-200 text-rose-900' : 'bg-emerald-50 border border-emerald-200 text-emerald-900'}`}>
                  {viewingOrder.isLate || (viewingOrder.lateDays || 0) > 0
                    ? `⚠ Delivered Late — Late by ${viewingOrder.lateDays || 0} day${(viewingOrder.lateDays || 0) === 1 ? '' : 's'} (expected ${viewingOrder.expectedDeliveryDate}, actual ${viewingOrder.actualDeliveryDate})`
                    : `✓ Delivered On Time (expected ${viewingOrder.expectedDeliveryDate}, actual ${viewingOrder.actualDeliveryDate})`}
                </div>
              )}

              {viewingOrder.lateDeliveryReason && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900">
                  <span className="font-bold block mb-1">Late Delivery Reason:</span>
                  {viewingOrder.lateDeliveryReason}
                  {viewingOrder.customLateReason && <div className="mt-0.5 italic">"{viewingOrder.customLateReason}"</div>}
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setViewingOrder(null)}
                  className="px-6 py-2 text-xs font-bold text-white bg-[#166534] hover:bg-[#14532d] rounded-xl"
                >
                  Close Slip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={Boolean(deletingOrderId)}
        title="Delete Stitching Order"
        message="Are you sure you want to remove this stitching order from the queue? This will delete all associated measurements and delivery logs."
        confirmLabel="Delete Order"
        isDestructive
        onConfirm={() => {
          if (deletingOrderId) {
            onDeleteOrder(deletingOrderId);
            setDeletingOrderId(null);
          }
        }}
        onCancel={() => setDeletingOrderId(null)}
      />
    </div>
  );
};

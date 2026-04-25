'use client';
import { useState, Fragment } from 'react';
import { CheckSquare, Square, ChevronDown, AlertCircle } from 'lucide-react';
import { C } from '@/lib/theme';
import { StatusPill } from './StatusPill';
import { StatusMenu } from './StatusMenu';
import { OrderDetail } from './OrderDetail';

const GRID_TEMPLATE = '36px 60px 1fr 120px 130px 1fr 110px 90px 36px';

function OrderRow({
  order, isSelected, isExpanded, designsCount,
  onToggle, onExpand, onUpdateStatus, statusMenuOpen, onStatusMenuToggle,
}) {
  return (
    <div
      className="grid items-center px-4 py-3 text-sm transition cursor-pointer"
      style={{
        borderBottom: isExpanded ? 'none' : `1px solid ${C.line2}`,
        background: isSelected ? C.cream : (isExpanded ? C.cream2 : C.white),
        gridTemplateColumns: GRID_TEMPLATE,
      }}
      onMouseEnter={(e) => !isSelected && !isExpanded && (e.currentTarget.style.background = C.cream + '88')}
      onMouseLeave={(e) => !isSelected && !isExpanded && (e.currentTarget.style.background = C.white)}
    >
      <button onClick={onToggle} style={{ color: isSelected ? C.accent : C.ink3 }}>
        {isSelected ? <CheckSquare size={15} /> : <Square size={15} />}
      </button>
      <span className="font-mono" style={{ color: C.ink2 }}>#{1000 + order.sn}</span>
      <div onClick={onExpand}>
        <div className="font-medium flex items-center gap-1.5">
          {order.name}
          {designsCount > 0 && (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full font-mono"
              style={{ background: C.accent + '22', color: C.accent }}
            >
              {designsCount}d
            </span>
          )}
        </div>
        {order.deadline && (
          <div className="text-xs flex items-center gap-1 mt-0.5" style={{ color: C.warn }}>
            <AlertCircle size={10} /> {order.deadline}
          </div>
        )}
      </div>
      <span className="font-mono text-xs" style={{ color: C.ink2 }}>{order.phone}</span>
      <div className="relative">
        <button onClick={(e) => { e.stopPropagation(); onStatusMenuToggle(); }}>
          <StatusPill status={order.status} />
        </button>
        {statusMenuOpen && (
          <StatusMenu
            current={order.status}
            onSelect={onUpdateStatus}
            onClose={() => onStatusMenuToggle(false)}
          />
        )}
      </div>
      <div className="text-xs flex flex-wrap gap-1">
        {order.items.map((it, i) => (
          <span
            key={i}
            className="px-1.5 py-0.5 rounded font-mono"
            style={{ background: C.cream2, color: C.ink, fontSize: 11 }}
          >
            {String(it.color).split(' ')[0]} {it.size}
          </span>
        ))}
      </div>
      <span className="text-xs" style={{ color: C.ink2 }}>{order.branch}</span>
      <span className="text-right font-mono" style={{ color: order.remCod > 0 ? C.ink : C.ok }}>
        {order.remCod > 0 ? `${order.remCod}` : 'PAID'}
      </span>
      <button onClick={onExpand} style={{ color: C.ink3 }}>
        <ChevronDown
          size={16}
          style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
        />
      </button>
    </div>
  );
}

export function OrdersTable({
  orders, selection, onUpdateOrder, onUpdateStatus, designs,
  onAddDesign, onUpdateDesign, onRemoveDesign,
}) {
  const [expandedId, setExpandedId] = useState(null);
  const [statusMenuFor, setStatusMenuFor] = useState(null);

  const allSelected = orders.length > 0 && orders.every(o => selection.has(o.id));

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: C.white, border: `1px solid ${C.line}` }}
    >
      <div
        className="grid items-center px-4 py-3 text-xs uppercase tracking-wider"
        style={{
          color: C.ink3,
          background: C.cream2,
          borderBottom: `1px solid ${C.line}`,
          gridTemplateColumns: GRID_TEMPLATE,
        }}
      >
        <button
          onClick={() => allSelected ? selection.clear() : selection.setAll(orders.map(o => o.id))}
          style={{ color: C.ink2 }}
        >
          {allSelected ? <CheckSquare size={15} /> : <Square size={15} />}
        </button>
        <span>SN</span>
        <span>Customer</span>
        <span>Phone</span>
        <span>Status</span>
        <span>T-shirts</span>
        <span>Branch</span>
        <span className="text-right">COD</span>
        <span></span>
      </div>

      {orders.length === 0 ? (
        <div className="px-4 py-12 text-center" style={{ color: C.ink3 }}>
          No orders match.
        </div>
      ) : orders.map((o) => {
        const isExpanded = expandedId === o.id;
        return (
          <Fragment key={o.id}>
            <OrderRow
              order={o}
              isSelected={selection.has(o.id)}
              isExpanded={isExpanded}
              designsCount={(designs[o.id] || []).length}
              onToggle={() => selection.toggle(o.id)}
              onExpand={() => setExpandedId(isExpanded ? null : o.id)}
              onUpdateStatus={(s) => onUpdateStatus(o.id, s)}
              statusMenuOpen={statusMenuFor === o.id}
              onStatusMenuToggle={(force) => {
                if (force === false) setStatusMenuFor(null);
                else setStatusMenuFor(statusMenuFor === o.id ? null : o.id);
              }}
            />
            {isExpanded && (
              <OrderDetail
                order={o}
                designs={designs}
                onUpdate={onUpdateOrder}
                onAddDesign={onAddDesign}
                onUpdateDesign={onUpdateDesign}
                onRemoveDesign={onRemoveDesign}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}

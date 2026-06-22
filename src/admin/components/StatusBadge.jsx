import React from 'react';
import { STATUS_STYLES } from './statusStyles';
import { ORDER_STATUS } from '../../contexts/OrderContext';

const StatusBadge = ({ status, size = 'sm' }) => {
  const s = STATUS_STYLES[status] || STATUS_STYLES[ORDER_STATUS.PENDING];
  const textSize = size === 'lg' ? 'text-xs' : 'text-[9px]';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border font-bold tracking-widest uppercase ${textSize} ${s.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
};

export default StatusBadge;

import { ORDER_STATUS } from '../../contexts/OrderContext';

export const STATUS_STYLES = {
  [ORDER_STATUS.PENDING]:   { cls: 'text-amber-400 bg-amber-400/10 border-amber-400/30',    icon: 'schedule',      dot: 'bg-amber-400' },
  [ORDER_STATUS.CONFIRMED]: { cls: 'text-blue-400 bg-blue-400/10 border-blue-400/30',       icon: 'check_circle',  dot: 'bg-blue-400' },
  [ORDER_STATUS.PREPARING]: { cls: 'text-orange-400 bg-orange-400/10 border-orange-400/30', icon: 'outdoor_grill', dot: 'bg-orange-400' },
  [ORDER_STATUS.READY]:     { cls: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30', icon: 'done_all',   dot: 'bg-emerald-400' },
  [ORDER_STATUS.COMPLETED]: { cls: 'text-stone-400 bg-stone-800/60 border-stone-700',       icon: 'inventory_2',   dot: 'bg-stone-500' },
  [ORDER_STATUS.CANCELLED]: { cls: 'text-red-400 bg-red-400/10 border-red-400/30',          icon: 'cancel',        dot: 'bg-red-400' },
};

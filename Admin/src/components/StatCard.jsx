import {
  ArrowDownRight,
  ArrowUpRight,
  ShoppingBag,
  Wrench,
  Package,
  PoundSterling,
} from "lucide-react";

import "./StatCard.css";

const iconMap = {
  orders: ShoppingBag,
  repairs: Wrench,
  products: Package,
  revenue: PoundSterling,
};

const StatCard = ({
  title,
  value,
  change,
  type,
  positive = true,
}) => {
  const Icon = iconMap[type];

  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div className={`stat-icon stat-${type}`}>
          <Icon size={21} strokeWidth={2.2} />
        </div>

        <span
          className={`stat-change ${
            positive ? "change-positive" : "change-negative"
          }`}
        >
          {positive ? (
            <ArrowUpRight size={14} />
          ) : (
            <ArrowDownRight size={14} />
          )}

          {change}
        </span>
      </div>

      <div className="stat-card-content">
        <span className="stat-title">{title}</span>

        <h3>{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;
interface SideCardProps {
  delivered: number;
  total: number;
  name: string;
}

export default function SideCard({ delivered, total, name }: SideCardProps) {
  return (
    <div className="rounded-2xl p-4 w-1/6 bg-primary-500/10">
      <div className="flex flex-col gap-2 justify-between overflow-hidden">
        {/* Top Line - Delivery Status */}
        <div className="text-body1 text-primary-500 leading-tight">
          <span>Entregado: </span>
          <span className="font-bold">{delivered}</span>
          <span>/{total}</span>
        </div>

        {/* Bottom Line - Side Name */}
        <div
          className="text-body2 text-primary-500 leading-tight"
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "100%",
          }}
        >
          {name}
        </div>
      </div>
    </div>
  );
}

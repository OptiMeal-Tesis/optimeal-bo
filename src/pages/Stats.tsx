import React, { useState, useMemo, useEffect } from "react";
import { useGetStats } from "../hooks/useStats";
import { StatsSummaryCard } from "../components/StatsSummaryCard";
import { DonutChart } from "../components/DonutChart";
import { OrdersTable } from "../components/OrdersTable";
import CustomTextField from "../components/CustomTextField";
import { Loader } from "../components/Loader";
import { DateRangePicker } from "../components/DateRangePicker";
import dayjs, { Dayjs } from "dayjs";
import { useSearchParams } from "react-router-dom";
type DateRange<T> = [T | null, T | null];
import type { StatsFilters } from "../types/stats";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(price);
};

const formatDate = (dateString: string) => {
  const date = dayjs(dateString);
  return date.format("DD [de] MMM [de] YYYY");
};

export const Stats: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const today = dayjs();

  // Get dates from URL params or use today as default
  const getDatesFromParams = (): { startDate: string; endDate: string } => {
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (startDate && endDate) {
      return { startDate, endDate };
    }

    return {
      startDate: today.format("YYYY-MM-DD"),
      endDate: today.format("YYYY-MM-DD"),
    };
  };

  const initialDates = getDatesFromParams();

  const [statsFilters, setStatsFilters] = useState<StatsFilters>({
    startDate: initialDates.startDate,
    endDate: initialDates.endDate,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange<Dayjs>>([
    dayjs(initialDates.startDate),
    dayjs(initialDates.endDate),
  ]);

  const { data: statsData, isLoading, error } = useGetStats(statsFilters);

  // Sync with URL params changes
  useEffect(() => {
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (startDate && endDate) {
      const startDayjs = dayjs(startDate);
      const endDayjs = dayjs(endDate);

      setSelectedDateRange([startDayjs, endDayjs]);
      setStatsFilters({
        startDate: startDate,
        endDate: endDate,
      });
    }
  }, [searchParams]);

  // Process data for donut chart
  const donutChartData = useMemo(() => {
    if (!statsData?.data?.orders) return [];

    const productCounts: { [key: string]: number } = {};

    statsData.data.orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        const productName = item.product.name;
        productCounts[productName] =
          (productCounts[productName] || 0) + item.quantity;
      });
    });

    const getCssVar = (name: string) =>
      window
        .getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim() || undefined;

    const primaryShades = [
      getCssVar("--color-primary-300"),
      getCssVar("--color-primary-400"),
      getCssVar("--color-primary-600"),
    ].filter(Boolean) as string[];

    const accentColors = [
      "#FFB74D", // orange
      "#26C6DA", // cyan
      "#7E57C2", // purple
      "#FF7043", // deep orange
      "#66BB6A", // green (not success token)
      "#EC407A", // pink
    ];

    // Interleave primary with accents for better contrast
    const colors = (() => {
      const out: string[] = [];
      const maxLen = Math.max(primaryShades.length, accentColors.length);
      for (let i = 0; i < maxLen; i++) {
        if (primaryShades[i]) out.push(primaryShades[i]);
        if (accentColors[i]) out.push(accentColors[i]);
      }
      return out;
    })();

    return Object.entries(productCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .map((item, index) => ({
        name: item.name,
        value: item.value,
        color: colors[index % colors.length],
      }));
  }, [statsData]);

  const totalItems = donutChartData.reduce((sum, item) => sum + item.value, 0);

  // Convert stats orders to OrdersTable format
  const convertedOrders = useMemo(() => {
    if (!statsData?.data?.orders) return [];

    return statsData.data.orders.map((order) => ({
      id: order.id,
      user: {
        id: order.user.id,
        name: order.user.name,
        email: order.user.email,
        nationalId: order.user.national_id,
      },
      status: order.status as any,
      totalPrice: order.totalPrice,
      shift: order.shift,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      orderItems: order.orderItems.map((item) => ({
        id: item.id,
        product: {
          id: item.product.id,
          name: item.product.name,
          description: "",
          price: item.product.price,
          imageUrl: item.product.photo,
          isAvailable: true,
        },
        side: item.orderItemSide
          ? {
              id: item.orderItemSide.side.id,
              name: item.orderItemSide.side.name,
              price: 0,
              isAvailable: true,
            }
          : undefined,
        quantity: item.quantity,
        notes: item.notes,
        unitPrice: item.unitPrice,
      })),
    }));
  }, [statsData]);

  // Filter orders based on search term
  const filteredOrders = useMemo(() => {
    if (!convertedOrders) return [];

    if (!searchTerm.trim()) return convertedOrders;

    const searchLower = searchTerm.toLowerCase();
    return convertedOrders.filter(
      (order) =>
        order.id.toString().includes(searchLower) ||
        order.user.nationalId.includes(searchLower) ||
        order.user.name.toLowerCase().includes(searchLower)
    );
  }, [convertedOrders, searchTerm]);

  const handleDateRangePickerChange = (startDate: Date, endDate: Date) => {
    const startDayjs = dayjs(startDate);
    const endDayjs = dayjs(endDate);

    const startDateStr = startDayjs.format("YYYY-MM-DD");
    const endDateStr = endDayjs.format("YYYY-MM-DD");

    // Update URL params
    setSearchParams({
      startDate: startDateStr,
      endDate: endDateStr,
    });

    setSelectedDateRange([startDayjs, endDayjs]);
    setStatsFilters({
      startDate: startDateStr,
      endDate: endDateStr,
    });
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error al cargar las estadísticas</p>
        </div>
      </div>
    );
  }

  if (!statsData?.data) {
    return (
      <div className="p-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-gray-800">No hay datos disponibles</p>
        </div>
      </div>
    );
  }

  const { summary } = statsData.data;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 z-10 bg-gray-100 py-2">
        <div className="flex flex-col gap-2">
          <span className="text-h2-bold text-primary-500">Estadísticas</span>
          <span className="text-body1-bold text-primary-500">
            {selectedDateRange[0] && selectedDateRange[1]
              ? selectedDateRange[0].format("YYYY-MM-DD") ===
                selectedDateRange[1].format("YYYY-MM-DD")
                ? formatDate(selectedDateRange[0].format("YYYY-MM-DD"))
                : `${formatDate(
                    selectedDateRange[0].format("YYYY-MM-DD")
                  )} - ${formatDate(selectedDateRange[1].format("YYYY-MM-DD"))}`
              : ""}
          </span>
        </div>
        <DateRangePicker
          value={selectedDateRange}
          onChange={handleDateRangePickerChange}
          placeholder="Seleccionar rango de fechas"
        />
      </div>

      {/* Main Content Grid */}
      <div className="flex flex-row gap-4">
        {/* Left Column - Summary Cards */}
        <div className="flex flex-col gap-4">
          <StatsSummaryCard
            title="Recaudación total"
            value={formatPrice(summary.totalRevenue)}
            color="blue"
          />
          <StatsSummaryCard
            title="Órdenes"
            value={summary.totalOrders}
            color="green"
          />
          <StatsSummaryCard
            title="Órdenes canceladas"
            value={summary.cancelledOrders}
            color="red"
          />
        </div>

        {/* Right Column - Donut Chart */}
        <div className="h-full w-full flex-1">
          <DonutChart
            data={donutChartData}
            title={`Platos pedidos`}
            total={totalItems}
          />
        </div>
      </div>

      {/* Orders Table - Full Width */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-body1-bold text-gray-900">
            Órdenes realizadas
          </span>
          <div>
            <CustomTextField
              label="Buscar"
              placeholder="ID orden, DNI, Nombre"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
              size="small"
            />
          </div>
        </div>
        <OrdersTable
          orders={filteredOrders}
          isLoading={isLoading}
          statsPage={true}
        />
      </div>
    </div>
  );
};

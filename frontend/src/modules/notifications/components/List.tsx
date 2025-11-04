import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useGetList from "@/api/services/getServices/useGetList";
import { DataTable, type TableColumn } from "@/components/table/DataTable";
import type { FilterConfig } from "@/components/table/SearchComponent";
import type { Notification } from "@/interface/INotification";
import { NotificationItemList } from "./ItemList";

const headers: TableColumn[] = [
  { title: "ID", key: "id", className: "w-16" },
  { title: "Mensaje", key: "message" },
  { title: "Enviado", key: "sendDate" },
  { title: "Clubes", key: "relatedClubs" },
  { title: "Eventos", key: "relatedEvents" },
];

const filters: FilterConfig[] = [
  {
    key: "message",
    label: "Mensaje",
    type: "text",
    placeholder: "Buscar por mensaje...",
  },
];

export const NotificationsList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const { data, isLoading, refetch, isFetching } = useGetList({
    key: "notificationsList",
    resource: ["notifications"],
    keyResults: "data",
    enabled: true,
    params: searchParams,
  });

  // Avoid infinity loops handle manually refetch
  useEffect(() => {
    if (!isLoading && !isFetching && shouldRefetch) {
      refetch();
      setShouldRefetch(false);
    }
  }, [isLoading, isFetching, refetch, shouldRefetch]);

  // Detect changes in searchparams to do the refetch
  useEffect(() => {
    setShouldRefetch(true);
  }, [searchParams]);

  // Ensure data is properly typed as Notification array
  const notifications: Notification[] = React.useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) {
      return data;
    }
    console.warn("Unexpected data structure:", data);
    return [];
  }, [data]);

  // Render function for each row
  const renderRow = (notification: Notification) => (
    <NotificationItemList key={notification.id} notification={notification} />
  );

  return (
    <div className="relative overflow-x-auto rounded-lg xl:overflow-visible p-4">
      <DataTable
        data={notifications}
        headers={headers}
        filters={filters}
        renderRow={renderRow}
        loading={isLoading}
        emptyMessage="No se encontraron notificaciones"
        className="mt-6"
      />
    </div>
  );
};

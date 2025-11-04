import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useGetList from "@/api/services/getServices/useGetList";
import { DataTable, type TableColumn } from "@/components/table/DataTable";
import type { FilterConfig } from "@/components/table/SearchComponent";
import type { User } from "@/interface/IUser";
import { UserItemList } from "./ItemList";

const headers: TableColumn[] = [
  { title: "ID", key: "id", className: "w-16" },
  { title: "Nombre", key: "name" },
  { title: "Email", key: "email" },
  { title: "Ciudad", key: "cityName" },
  { title: "Activo", key: "active" },
  { title: "Fecha de creación", key: "createdAt" },
];

const filters: FilterConfig[] = [
  {
    key: "name",
    label: "Nombre",
    type: "text",
    placeholder: "Buscar por nombre...",
  },
  {
    key: "email",
    label: "Email",
    type: "text",
    placeholder: "Buscar por email...",
  },
  {
    key: "active",
    label: "Activo",
    type: "select",
    options: [
      { key: "true", value: "Sí" },
      { key: "false", value: "No" },
    ],
  },
];

export const UsersList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const { data, isLoading, refetch, isFetching } = useGetList({
    key: "usersList",
    resource: ["users"],
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

  // Ensure data is properly typed as User array
  const users: User[] = React.useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    console.warn("Unexpected data structure:", data);
    return [];
  }, [data]);

  // Render function for each row
  const renderRow = (user: User) => (
    <UserItemList key={user.id} user={user} />
  );

  return (
    <div className="relative overflow-x-auto rounded-lg xl:overflow-visible p-4">
      <DataTable
        data={users}
        headers={headers}
        filters={filters}
        renderRow={renderRow}
        loading={isLoading}
        emptyMessage="No se encontraron usuarios"
        className="mt-6"
      />
    </div>
  );
};

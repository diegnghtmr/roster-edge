import React from "react";
import type { User } from "@/interface/IUser";
import { Badge } from "@/components/ui/badge";

interface UserItemListProps {
  user: User;
}

export const UserItemList: React.FC<UserItemListProps> = ({
  user,
}) => {
  // Format date array to string
  const formatCreatedDate = (
    dateArray: [number, number, number, number, number, number, number],
  ): string => {
    if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) {
      return "N/A";
    }
    const [year, month, day] = dateArray;
    return `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year}`;
  };

  const getActiveBadge = (active: boolean) => {
    return active ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        Activo
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-gray-100 text-gray-800">
        Inactivo
      </Badge>
    );
  };

  return (
    <tr className="border-b hover:bg-gray-50 transition-colors duration-200">
      <td className="px-6 py-4 text-sm font-medium text-gray-900">
        {user.id}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {user.name}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {user.email}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {user.cityName || "N/A"}
      </td>
      <td className="px-6 py-4 text-sm">
        {getActiveBadge(user.active)}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {formatCreatedDate(user.createdAt)}
      </td>
    </tr>
  );
};

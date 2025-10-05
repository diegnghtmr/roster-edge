import type { ILoginUser } from "@/interface/ILogin";
import { Typography } from "@mui/material";
import { memo, type ReactNode } from "react";

interface IProps {
  image: string | ReactNode;
  user: ILoginUser;
}

export const Profile = memo(({ image, user }: IProps) => {
  console.log(user);
  return (
    <div className="flex gap-2 items-center">
      {image}
      <div>
        <Typography className={`text-gray-900 `}>{"Roster Admin"}</Typography>
        <span className="text-gray-900 text-[10px]">{user?.email}</span>
      </div>
    </div>
  );
});

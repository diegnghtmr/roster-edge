import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import useUserStore from "../../storage/storeUser";
import { Button } from "../ui/button";

const ContentLogout = memo(() => {
  const [, , removeCookie] = useCookies(["token"]);
  const { clearUser } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearUser();
    removeCookie("token");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex flex-col space-y-2">
      <Button className="text-white cursor-pointer" onClick={handleLogout}>
        Ver perfil
      </Button>
      <Button className="text-white cursor-pointer" onClick={handleLogout}>
        Cerrar Sesión
      </Button>
    </div>
  );
});

export default ContentLogout;

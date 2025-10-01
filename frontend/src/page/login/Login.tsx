import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import useUserStore from "../../storage/storeUser";
import { useMutateService } from "../../api/services/useMutation";
import type { ILoginResponse, ILoginUser } from "../../interface/ILogin";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

const Login = () => {
  const { setUser } = useUserStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const { mutate } = useMutateService(["roster/login"]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    mutate(credentials, {
      onSuccess: (response: ILoginResponse) => {
        if (response?.data?.token) {
          // Decode and store user data
          const decodedToken: ILoginUser = jwtDecode(response.data.token);
          localStorage.setItem("token", response.data.token);
          setUser(decodedToken);
          navigate("/dashboard");
        } else {
          setError("Login failed");
        }
      },
      onError: (error: string) => {
        setError(error || "Login failed");
      },
      onSettled: () => {
        setIsLoading(false);
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <img
            className="mx-auto h-full w-full"
            src="roster-logo.jpeg"
            alt="Logo"
          />
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;

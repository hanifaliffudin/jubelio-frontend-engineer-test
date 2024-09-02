"use client";

import { loginToDummy } from "@/app/api/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Login = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { updateToken, updateRefreshToken } = useAuthStore();

  // handle login
  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const res = await loginToDummy(username, password);
      const data = await res.json();

      if (data.message) {
        toast({
          title: "Error",
          description: data.message,
        });
      } else {
        // save token and refreshToken
        updateToken(data.token);
        updateRefreshToken(data.refreshToken);

        router.push("/products");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-4">
              <div>
                <Label>Username</Label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  name="username"
                  type="text"
                  placeholder="username"
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  name="password"
                  type="password"
                  placeholder="password"
                />
              </div>
              <Button disabled={isLoading} type="submit">
                Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
};

export default Login;

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const Login = () => {
  const navigate = useNavigate();
  const { user, isLoading, signIn } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleGoogleLogin = () => {
    signIn();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Email Classifier
          </h1>
          <p className="text-muted-foreground">
            Organize your inbox with AI-powered classification
          </p>
        </div>

        <Card className="shadow-card border-border/50 backdrop-blur-sm bg-card/50">
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>
              Sign in with your Google account to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow"
              size="lg"
            >
              <Mail className="mr-2 h-5 w-5" />
              {isLoading ? "Connecting..." : "Continue with Google"}
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          By signing in, you agree to access your Gmail for classification
        </p>
      </div>
    </div>
  );
};

export default Login;

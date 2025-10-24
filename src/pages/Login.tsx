import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { generateGoogleAuthUrl } from "@/lib/google-auth";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleGoogleLogin = () => {
    console.log('Starting Google OAuth...');
    console.log('Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
    console.log('Current URL:', window.location.origin);
    
    const authUrl = generateGoogleAuthUrl();
    console.log('Auth URL:', authUrl);
    
    window.location.href = authUrl;
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
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow"
              size="lg"
            >
              <Mail className="mr-2 h-5 w-5" />
              Continue with Google
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          By signing in, you agree to access your Gmail for classification
        </p>
        
        {/* Debug info */}
        <div className="mt-4 p-4 bg-muted rounded-lg text-xs">
          <p><strong>Debug Info:</strong></p>
          <p>Client ID: {import.meta.env.VITE_GOOGLE_CLIENT_ID ? 'Set' : 'Not Set'}</p>
          <p>Origin: {window.location.origin}</p>
          <p>Expected Redirect: {window.location.origin}/auth/callback</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  const handleGoogleLogin = async () => {
    console.log('Supabase URL:', supabase.supabaseUrl);
    console.log('Current origin:', window.location.origin);
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        scopes: 'email profile https://www.googleapis.com/auth/gmail.readonly'
      }
    });
    
    if (error) {
      console.error('Error signing in:', error);
    }
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
          <p>Supabase URL: {supabase.supabaseUrl}</p>
          <p>Origin: {window.location.origin}</p>
          <p>Expected Redirect: {supabase.supabaseUrl}/auth/v1/callback</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
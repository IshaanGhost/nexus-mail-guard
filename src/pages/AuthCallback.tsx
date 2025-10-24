import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  useEffect(() => {
    // The OAuth callback is handled by the AuthProvider
    // This component just shows a loading state
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Completing Sign In...</h2>
        <p className="text-muted-foreground">
          Please wait while we complete your authentication.
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, Sparkles, Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/50 backdrop-blur-sm bg-card/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Email Classifier
          </h1>
          <Button 
            onClick={() => navigate("/login")}
            className="bg-gradient-primary hover:opacity-90 shadow-glow"
          >
            Get Started
          </Button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent leading-tight">
              Organize Your Inbox
              <br />
              with AI Power
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Automatically classify your emails into categories using advanced AI.
              Save time and stay organized effortlessly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              onClick={() => navigate("/login")}
              className="bg-gradient-primary hover:opacity-90 shadow-glow text-lg px-8 py-6"
            >
              <Mail className="mr-2 h-5 w-5" />
              Sign In with Google
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="p-6 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI-Powered</h3>
              <p className="text-muted-foreground">
                Uses GPT-4 to intelligently classify your emails into meaningful categories
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4 mx-auto">
                <Mail className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Gmail Integration</h3>
              <p className="text-muted-foreground">
                Seamlessly fetch and organize emails directly from your Gmail account
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4 mx-auto">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
              <p className="text-muted-foreground">
                Your data stays private. API keys stored locally, emails never saved on servers
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/50 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Email Classifier - Organize your inbox intelligently
        </div>
      </footer>
    </div>
  );
};

export default Index;

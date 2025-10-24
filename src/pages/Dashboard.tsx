import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Key, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { EmailTable } from "@/components/EmailTable";

export interface Email {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  category?: "Important" | "Promotions" | "Social" | "Marketing" | "Spam";
  date: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openaiKey, setOpenaiKey] = useState("");
  const [emails, setEmails] = useState<Email[]>([]);
  const [fetchingEmails, setFetchingEmails] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      setUser(session.user);
      
      // Load saved OpenAI key and emails from localStorage
      const savedKey = localStorage.getItem("openai_key");
      const savedEmails = localStorage.getItem("emails");
      
      if (savedKey) setOpenaiKey(savedKey);
      if (savedEmails) setEmails(JSON.parse(savedEmails));
      
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/login");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSaveKey = () => {
    if (!openaiKey.trim()) {
      toast.error("Please enter a valid OpenAI API key");
      return;
    }
    localStorage.setItem("openai_key", openaiKey);
    toast.success("OpenAI API key saved successfully");
  };

  const handleFetchEmails = async () => {
    if (!openaiKey.trim()) {
      toast.error("Please save your OpenAI API key first");
      return;
    }

    setFetchingEmails(true);
    try {
      // TODO: Implement Gmail API fetch in next phase
      // Mock data for now
      const mockEmails: Email[] = [
        {
          id: "1",
          from: "john@example.com",
          subject: "Quarterly Report Review",
          snippet: "Please review the attached quarterly report...",
          date: new Date().toISOString(),
        },
        {
          id: "2",
          from: "promotions@store.com",
          subject: "50% OFF - Limited Time Offer!",
          snippet: "Don't miss out on our biggest sale of the year...",
          date: new Date().toISOString(),
        },
      ];

      setEmails(mockEmails);
      localStorage.setItem("emails", JSON.stringify(mockEmails));
      toast.success("Emails fetched successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch emails");
    } finally {
      setFetchingEmails(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 backdrop-blur-sm bg-card/30 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Email Classifier
          </h1>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              OpenAI Configuration
            </CardTitle>
            <CardDescription>
              Enter your OpenAI API key to enable email classification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="openai-key">API Key</Label>
              <div className="flex gap-2">
                <Input
                  id="openai-key"
                  type="password"
                  placeholder="sk-..."
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSaveKey} className="bg-gradient-primary hover:opacity-90">
                  Save Key
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Email Management
            </CardTitle>
            <CardDescription>
              Fetch and classify your latest emails
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleFetchEmails} 
              disabled={fetchingEmails || !openaiKey}
              className="bg-gradient-primary hover:opacity-90"
            >
              {fetchingEmails ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fetching...
                </>
              ) : (
                "Fetch Last 15 Emails"
              )}
            </Button>
          </CardContent>
        </Card>

        {emails.length > 0 && <EmailTable emails={emails} />}
      </main>
    </div>
  );
};

export default Dashboard;

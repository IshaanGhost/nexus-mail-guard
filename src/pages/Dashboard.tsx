import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, Key, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { EmailTable } from "@/components/EmailTable";
import { classifyEmailsClient } from "@/lib/classify-emails-api";

export interface Email {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  category?: "Important" | "Promotional" | "Social" | "Marketing" | "Spam" | "General";
  reason?: string;
  date: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openaiKey, setOpenaiKey] = useState("");
  const [emails, setEmails] = useState<Email[]>([]);
  const [fetchingEmails, setFetchingEmails] = useState(false);
  const [classifiedEmails, setClassifiedEmails] = useState<Email[]>([]);
  const [classifyingEmails, setClassifyingEmails] = useState(false);

  useEffect(() => {
    // Check for user session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        setAccessToken(session.provider_token || null);
      } else {
        navigate("/login");
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAccessToken(session?.provider_token || null);
      if (!session) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    // Load saved OpenAI key and emails from localStorage
    const savedKey = localStorage.getItem("openai_key");
    const savedEmails = localStorage.getItem("emails");
    const savedClassifiedEmails = localStorage.getItem("classifiedEmails");
    
    if (savedKey) setOpenaiKey(savedKey);
    if (savedEmails) setEmails(JSON.parse(savedEmails));
    if (savedClassifiedEmails) setClassifiedEmails(JSON.parse(savedClassifiedEmails));
  }, []);

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
      // Use the new classification API
      const classifiedEmails = await classifyEmailsClient(openaiKey);
      
      // Convert ClassifiedEmail to Email format for display
      const emails: Email[] = classifiedEmails.map(email => ({
        id: email.id,
        from: email.from,
        subject: email.subject,
        snippet: email.snippet,
        category: email.category,
        reason: email.reason,
        date: email.date,
      }));

      setEmails(emails);
      localStorage.setItem("emails", JSON.stringify(emails));
      toast.success(`Successfully classified ${emails.length} emails`);
    } catch (error: any) {
      console.error("Error fetching and classifying emails:", error);
      toast.error(error.message || "Failed to fetch and classify emails");
    } finally {
      setFetchingEmails(false);
    }
  };

  const handleClassifyEmails = async () => {
    if (!openaiKey.trim()) {
      toast.error("Please save your OpenAI API key first");
      return;
    }

    if (!accessToken) {
      toast.error("Google access token not found. Please sign in again.");
      return;
    }

    setClassifyingEmails(true);
    try {
      // Call the API route
      const response = await fetch('/api/classify-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ openaiApiKey: openaiKey })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to classify emails');
      }

      const classifiedEmailsData = await response.json();
      
      // Convert to Email format and store
      const emails: Email[] = classifiedEmailsData.map((email: any) => ({
        id: email.id,
        from: email.from,
        subject: email.subject,
        snippet: email.snippet,
        category: email.category,
        reason: email.reason,
        date: email.date,
      }));

      setClassifiedEmails(emails);
      localStorage.setItem("classifiedEmails", JSON.stringify(emails));
      toast.success(`Successfully classified ${emails.length} emails`);
    } catch (error: any) {
      console.error("Error classifying emails:", error);
      toast.error(error.message || "Failed to classify emails");
    } finally {
      setClassifyingEmails(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (isLoading) {
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
          <CardContent className="space-y-4">
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
            
            <div className="pt-4 border-t border-border/50">
              <Button 
                onClick={handleClassifyEmails} 
                disabled={classifyingEmails || !openaiKey}
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 text-lg"
              >
                {classifyingEmails ? (
                  <>
                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                    Classifying My Last 15 Emails...
                  </>
                ) : (
                  <>
                    <Mail className="mr-3 h-6 w-6" />
                    Classify My Last 15 Emails
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {emails.length > 0 && <EmailTable emails={emails} />}

        {classifiedEmails.length > 0 && (
          <Card className="shadow-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Classified Emails ({classifiedEmails.length})
              </CardTitle>
              <CardDescription>
                Your emails have been automatically classified using AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {classifiedEmails.map((email) => (
                  <div key={email.id} className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-medium text-sm text-muted-foreground truncate">
                          {email.from}
                        </span>
                        <Badge 
                          variant="outline" 
                          className={`text-xs font-medium ${
                            email.category === 'Important' ? 'bg-green-100 text-green-800 border-green-200' :
                            email.category === 'Promotional' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            email.category === 'Social' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                            email.category === 'Marketing' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                            email.category === 'Spam' ? 'bg-red-100 text-red-800 border-red-200' :
                            'bg-gray-100 text-gray-800 border-gray-200'
                          }`}
                        >
                          {email.category}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-foreground truncate">
                        {email.subject}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {email.snippet}
                      </p>
                      {email.reason && (
                        <p className="text-xs text-muted-foreground mt-2 italic">
                          Reason: {email.reason}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

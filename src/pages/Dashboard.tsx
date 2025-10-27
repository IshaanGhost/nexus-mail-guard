import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  const [demoMode, setDemoMode] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);
  
  // Force rebuild test - remove this after testing
  console.log('🚀 NEXUS MAIL GUARD v2.2 - MAJOR UPDATE DEPLOYED!');
  console.log('📧 Demo Mode Available');
  console.log('🔧 Real Gmail Integration Active');
  console.log('🎯 Enhanced UI Features Loaded');
  console.log('🔍 Current access token:', accessToken ? 'Present' : 'Missing');
  console.log('🔍 Current user:', user ? 'Logged in' : 'Not logged in');

  useEffect(() => {
    // Check for user session
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log('🔍 Dashboard - checking session:', { session: !!session, error });
      
      if (session) {
        setUser(session.user);
        // Try multiple ways to get the access token
        const token = session.provider_token || session.access_token || null;
        console.log('🔑 Session data:', session);
        console.log('🔑 Provider token:', session.provider_token);
        console.log('🔑 Access token:', session.access_token);
        console.log('🔑 Selected token:', token);
        setAccessToken(token);
      } else {
        console.log('❌ No session found, redirecting to login');
        navigate("/login");
      }
      setIsLoading(false);
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Dashboard - auth state change:', event, !!session);
      setUser(session?.user ?? null);
      const token = session?.provider_token || session?.access_token || null;
      console.log('🔄 Auth state change - token:', token);
      setAccessToken(token);
      if (!session) {
        console.log('❌ Session lost, redirecting to login');
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    // Load saved data from localStorage
    const savedKey = localStorage.getItem("openai_key");
    const savedEmails = localStorage.getItem("emails");
    const savedClassifiedEmails = localStorage.getItem("classifiedEmails");
    const savedUsageCount = localStorage.getItem("usage_count");
    const savedDemoMode = localStorage.getItem("demo_mode");
    
    if (savedKey) setOpenaiKey(savedKey);
    if (savedEmails) setEmails(JSON.parse(savedEmails));
    if (savedClassifiedEmails) setClassifiedEmails(JSON.parse(savedClassifiedEmails));
    if (savedUsageCount) setUsageCount(parseInt(savedUsageCount));
    if (savedDemoMode === 'true') setDemoMode(true);
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

    if (!accessToken) {
      toast.error("Google access token not found. Please sign in again.");
      return;
    }

    console.log('📧 Starting email fetch with token:', accessToken?.substring(0, 20) + '...');
    
    setFetchingEmails(true);
    try {
      // Use the new classification API with access token
      console.log('🔄 Calling classifyEmailsClient...');
      const classifiedEmails = await classifyEmailsClient(openaiKey, accessToken);
      console.log('✅ Received classified emails:', classifiedEmails.length);
      console.log('📧 Raw classified emails data:', classifiedEmails);
      
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

      console.log('📧 Processed emails:', emails);
      console.log('🔍 Email sources check:');
      emails.forEach((email, index) => {
        console.log(`Email ${index + 1}: ${email.from} - ${email.subject} (ID: ${email.id})`);
      });
      setEmails(emails);
      localStorage.setItem("emails", JSON.stringify(emails));
      toast.success(`Successfully classified ${emails.length} emails`);
    } catch (error: any) {
      console.error("❌ Error fetching and classifying emails:", error);
      toast.error(error.message || "Failed to fetch and classify emails");
    } finally {
      setFetchingEmails(false);
    }
  };

  const handleClassifyEmails = async () => {
    if (!demoMode && !openaiKey.trim()) {
      toast.error("Please save your OpenAI API key first or try demo mode");
      return;
    }

    if (!accessToken) {
      toast.error("Google access token not found. Please sign in again.");
      return;
    }

    // Check usage limits for demo mode
    if (demoMode && usageCount >= 3) {
      toast.error("Demo limit reached! Please add your OpenAI API key for unlimited usage.");
      return;
    }

    setClassifyingEmails(true);
    try {
      let classifiedEmailsData;
      
      if (demoMode) {
        // Demo mode with mock data
        classifiedEmailsData = generateMockClassifiedEmails();
        setUsageCount(prev => {
          const newCount = prev + 1;
          localStorage.setItem("usage_count", newCount.toString());
          return newCount;
        });
      } else {
        // Real API call using client-side classification
        console.log('🔄 Calling classifyEmailsClient...');
        classifiedEmailsData = await classifyEmailsClient(openaiKey, accessToken);
        console.log('✅ Received classified emails:', classifiedEmailsData.length);
      }
      
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

      setEmails(emails);
      setClassifiedEmails(emails);
      localStorage.setItem("emails", JSON.stringify(emails));
      localStorage.setItem("classifiedEmails", JSON.stringify(emails));
      
      if (demoMode) {
        toast.success(`Demo: Classified ${emails.length} emails (${3 - usageCount - 1} demos remaining)`);
      } else {
        toast.success(`Successfully classified ${emails.length} emails`);
      }
    } catch (error: any) {
      console.error("Error classifying emails:", error);
      toast.error(error.message || "Failed to classify emails");
    } finally {
      setClassifyingEmails(false);
    }
  };

  const generateMockClassifiedEmails = () => {
    const mockEmails = [
      {
        id: "demo1",
        from: "john.doe@company.com",
        subject: "Quarterly Report Review",
        snippet: "Please review the attached quarterly report and provide feedback...",
        category: "Important",
        reason: "Work-related email with urgent business content",
        date: new Date().toISOString(),
      },
      {
        id: "demo2",
        from: "promotions@store.com",
        subject: "50% OFF - Limited Time Offer!",
        snippet: "Don't miss out on our biggest sale of the year...",
        category: "Promotional",
        reason: "Sales promotion with discount offer",
        date: new Date().toISOString(),
      },
      {
        id: "demo3",
        from: "sarah@social.com",
        subject: "You have 5 new notifications",
        snippet: "Check out what's happening in your social network...",
        category: "Social",
        reason: "Social media notification",
        date: new Date().toISOString(),
      },
      {
        id: "demo4",
        from: "newsletter@tech.com",
        subject: "Weekly Tech News",
        snippet: "This week's top tech stories and updates...",
        category: "Marketing",
        reason: "Newsletter with marketing content",
        date: new Date().toISOString(),
      },
      {
        id: "demo5",
        from: "spam@fake.com",
        subject: "You've won $1000!",
        snippet: "Click here to claim your prize immediately...",
        category: "Spam",
        reason: "Suspicious email with potential scam content",
        date: new Date().toISOString(),
      }
    ];
    
    return mockEmails;
  };

  const handleDemoMode = () => {
    setDemoMode(true);
    localStorage.setItem("demo_mode", "true");
    toast.success("Demo mode enabled! You can try 3 free classifications.");
  };

  const handleAddApiKey = () => {
    setShowTutorial(true);
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
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
            Nexus Mail Guard v2.3
          </h1>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Statistics Overview */}
        {(emails.length > 0 || classifiedEmails.length > 0) && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries({
              Important: { count: [...emails, ...classifiedEmails].filter(e => e.category === 'Important').length, color: 'bg-emerald-500' },
              Promotional: { count: [...emails, ...classifiedEmails].filter(e => e.category === 'Promotional').length, color: 'bg-amber-500' },
              Social: { count: [...emails, ...classifiedEmails].filter(e => e.category === 'Social').length, color: 'bg-blue-500' },
              Marketing: { count: [...emails, ...classifiedEmails].filter(e => e.category === 'Marketing').length, color: 'bg-purple-500' },
              Spam: { count: [...emails, ...classifiedEmails].filter(e => e.category === 'Spam').length, color: 'bg-red-500' },
              General: { count: [...emails, ...classifiedEmails].filter(e => e.category === 'General').length, color: 'bg-slate-500' },
            }).map(([category, { count, color }]) => (
              <Card key={category} className="shadow-md border-border/50 hover:shadow-lg transition-shadow">
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 mx-auto rounded-full ${color} flex items-center justify-center mb-2`}>
                    <span className="text-white font-bold text-lg">{count}</span>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">{category}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              OpenAI Configuration
            </CardTitle>
            <CardDescription>
              {demoMode ? "Demo mode active - 3 free classifications" : "Enter your OpenAI API key to enable email classification"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!demoMode ? (
              <>
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
                <div className="flex gap-2">
                  <Button onClick={handleDemoMode} variant="outline" className="flex-1">
                    Try Demo Mode (3 Free)
                  </Button>
                  <Button onClick={handleAddApiKey} variant="outline" className="flex-1">
                    How to Get API Key?
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Demo Mode Active</strong><br/>
                    You have {3 - usageCount} free classifications remaining.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => {
                      setDemoMode(false);
                      localStorage.removeItem("demo_mode");
                      toast.success("Demo mode disabled. Add your API key for unlimited usage.");
                    }} 
                    variant="outline" 
                    className="flex-1"
                  >
                    Switch to API Key
                  </Button>
                  <Button onClick={handleAddApiKey} variant="outline" className="flex-1">
                    Get API Key
                  </Button>
                </div>
              </div>
            )}
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
              disabled={classifyingEmails || (!demoMode && !openaiKey)}
              size="lg"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 text-lg"
            >
              {classifyingEmails ? (
                <>
                  <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                  {demoMode ? "Demo: Classifying Emails..." : "Classifying My Last 15 Emails..."}
                </>
              ) : (
                <>
                  <Mail className="mr-3 h-6 w-6" />
                  {demoMode ? `Try Demo (${3 - usageCount} left)` : "Classify My Last 15 Emails"}
                </>
              )}
            </Button>
            
            {demoMode && (
              <p className="text-sm text-muted-foreground text-center">
                Demo mode shows sample emails. Add your API key to classify your real emails.
              </p>
            )}
            </div>
          </CardContent>
        </Card>

        {(emails.length > 0 || classifiedEmails.length > 0) && (
          <EmailTable emails={emails.length > 0 ? emails : classifiedEmails} />
        )}


        {/* Tutorial Modal */}
        <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>How to Get Your OpenAI API Key</DialogTitle>
              <DialogDescription>
                Follow these steps to get your OpenAI API key for unlimited email classification
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Step 1: Create OpenAI Account</h4>
                <p className="text-sm text-muted-foreground">
                  Go to <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">platform.openai.com</a> and sign up with your email or Google account.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Step 2: Add Payment Method</h4>
                <p className="text-sm text-muted-foreground">
                  OpenAI requires a credit card for API usage. Don't worry - email classification is very affordable (about $0.01-0.05 per email).
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Step 3: Create API Key</h4>
                <p className="text-sm text-muted-foreground">
                  Go to API Keys section, click "Create new secret key", give it a name, and copy the key (starts with "sk-").
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Step 4: Paste Key Here</h4>
                <p className="text-sm text-muted-foreground">
                  Paste your API key in the input field above and click "Save Key". You're all set!
                </p>
              </div>
              
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>💡 Tip:</strong> You can try the demo mode first to see how the classification works before getting your API key!
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Dashboard;

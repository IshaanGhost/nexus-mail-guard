import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { Email } from "@/pages/Dashboard";

interface EmailTableProps {
  emails: Email[];
}

const categoryColors: Record<string, string> = {
  Important: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 font-semibold shadow-sm",
  Promotional: "bg-amber-500/10 text-amber-700 border-amber-500/20 font-semibold shadow-sm",
  Social: "bg-blue-500/10 text-blue-700 border-blue-500/20 font-semibold shadow-sm",
  Marketing: "bg-purple-500/10 text-purple-700 border-purple-500/20 font-semibold shadow-sm",
  Spam: "bg-red-500/10 text-red-700 border-red-500/20 font-semibold shadow-sm",
  General: "bg-slate-500/10 text-slate-700 border-slate-500/20 font-semibold shadow-sm",
};

export function EmailTable({ emails }: EmailTableProps) {
  return (
    <Card className="shadow-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          Classified Emails ({emails.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">From</TableHead>
                <TableHead className="font-semibold">Subject</TableHead>
                <TableHead className="font-semibold">Preview</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Reason</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {emails.map((email) => (
                <TableRow key={email.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">{email.from}</TableCell>
                  <TableCell className="max-w-xs truncate">{email.subject}</TableCell>
                  <TableCell className="max-w-md truncate text-muted-foreground">
                    {email.snippet}
                  </TableCell>
                  <TableCell>
                    {email.category ? (
                      <Badge variant="outline" className={categoryColors[email.category]}>
                        {email.category}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        Unclassified
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground text-sm">
                    {email.reason || 'No reason provided'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(email.date).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

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
  Important: "bg-success/20 text-success border-success/30",
  Promotions: "bg-warning/20 text-warning border-warning/30",
  Social: "bg-info/20 text-info border-info/30",
  Marketing: "bg-primary/20 text-primary border-primary/30",
  Spam: "bg-destructive/20 text-destructive border-destructive/30",
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

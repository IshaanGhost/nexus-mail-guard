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
  Important: "bg-green-100 text-green-800 border-green-200",
  Promotional: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Social: "bg-blue-100 text-blue-800 border-blue-200",
  Marketing: "bg-purple-100 text-purple-800 border-purple-200",
  Spam: "bg-red-100 text-red-800 border-red-200",
  General: "bg-gray-100 text-gray-800 border-gray-200",
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

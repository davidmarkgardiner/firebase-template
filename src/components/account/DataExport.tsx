import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Download, FileText, Calendar, Shield, Clock } from 'lucide-react';

export function DataExport() {
  return (
    <div className="space-y-6">
      <Card className="clay-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Download className="mr-2 h-5 w-5 text-primary" />
            Export Your Data
          </CardTitle>
          <CardDescription>
            Download a copy of your personal data in compliance with GDPR
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Profile Data', description: 'Personal information and preferences', size: '2.1 KB' },
              { title: 'Order History', description: 'Complete order and purchase history', size: '45.3 KB' },
              { title: 'Address Book', description: 'Saved shipping and billing addresses', size: '1.8 KB' },
              { title: 'Communication Log', description: 'Email and notification history', size: '12.7 KB' },
            ].map((item, index) => (
              <div key={index} className="p-4 border border-border/40 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <FileText className="h-5 w-5 text-primary mt-0.5" />
                  <Badge variant="outline" className="text-xs">{item.size}</Badge>
                </div>
                <h4 className="font-medium">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
          
          <div className="pt-4 border-t border-border/40">
            <Button className="w-full clay-button">
              <Download className="mr-2 h-4 w-4" />
              Request Complete Data Export
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Export will be available for download within 24 hours
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="clay-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-primary" />
            Recent Export Requests
          </CardTitle>
          <CardDescription>
            History of your data export requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: '2024-01-10', status: 'completed', downloadUntil: '2024-01-24' },
              { date: '2023-11-15', status: 'expired', downloadUntil: '2023-11-29' },
            ].map((request, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-border/40 rounded-lg">
                <div>
                  <p className="font-medium">Export requested on {request.date}</p>
                  <p className="text-sm text-muted-foreground">
                    {request.status === 'completed' ? `Available until ${request.downloadUntil}` : 'Download expired'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={`clay-badge ${
                    request.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </Badge>
                  {request.status === 'completed' && (
                    <Button variant="outline" size="sm">Download</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="clay-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5 text-primary" />
            Data Privacy Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong>What data is included:</strong> Your exported data includes all personal information 
              we have collected about you, including profile data, order history, preferences, and communication logs.
            </p>
            <p>
              <strong>Data format:</strong> Data is provided in JSON format for easy portability and readability.
            </p>
            <p>
              <strong>Security:</strong> Export files are encrypted and require authentication to download. 
              Links expire after 14 days for security.
            </p>
            <p>
              <strong>Processing time:</strong> Most requests are processed within 24 hours. You'll receive 
              an email notification when your export is ready.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
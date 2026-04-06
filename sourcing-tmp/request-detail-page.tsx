'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft, Check, CheckCircle, Factory, FileText, Image as ImageIcon,
  Download, Upload, Clock, Shield, Star, Warning, Pencil,
  CreditCard, Truck, Package, Eye, MessageSquare,
} from 'lucide-react';
import type { SourcingRequest, Quote, FileRecord, Activity } from '@/types';
import { REQUEST_STATUS_LABELS, REQUEST_STATUS_FLOW } from '@/types';

import { PageHeader } from '@/components/dashboard/page-header';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

const STAGE_LABELS: Record<string, string> = {
  new: 'New', quoting: 'Quoting', quoted: 'Quoted', negotiating: 'Negotiating',
  ordered: 'Ordered', shipped: 'Shipped', delivered: 'Delivered',
};

const STAGES = REQUEST_STATUS_FLOW.filter(s => s !== 'closed' && s !== 'cancelled');

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const min = Math.floor(diff / 60000), hr = Math.floor(diff / 3600000), day = Math.floor(diff / 86400000);
  if (min < 1) return 'Just now'; if (min < 60) return `${min}m ago`;
  if (hr < 24) return `${hr}h ago`; if (day < 7) return `${day}d ago`;
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const fmt = (n: number, c: string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: c }).format(n);

export default function RequestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [request, setRequest] = useState<SourcingRequest | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    fetch(`/api/requests/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.ok) {
          setRequest(data.data);
          setQuotes(data.data.quotes || []);
          setFiles(data.data.files || []);
          setActivity(data.data.activity || []);
        } else router.push('/requests');
      })
      .catch(() => router.push('/requests'))
      .finally(() => setLoading(false));
  }, [id, router]);

  const uploadFiles = useCallback(async (fileList: FileList | File[]) => {
    for (const file of Array.from(fileList)) {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('request_id', id);
      formData.append('category', 'reference');
      try {
        const res = await fetch('/api/files', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.ok) setFiles(f => [...f, data.data]);
      } finally { setUploading(false); }
    }
  }, [id]);

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) await uploadFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    if (e.dataTransfer.files.length > 0) await uploadFiles(e.dataTransfer.files);
  };

  if (loading) return (
    <div className="space-y-6">
      <div className="h-4 w-32 rounded bg-muted animate-pulse" />
      <div className="h-10 w-96 rounded bg-muted animate-pulse" />
      <div className="h-12 rounded-lg bg-muted animate-pulse" />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-40 rounded-lg bg-muted animate-pulse" />
          <div className="h-48 rounded-lg bg-muted animate-pulse" />
        </div>
        <div className="space-y-6">
          <div className="h-48 rounded-lg bg-muted animate-pulse" />
          <div className="h-64 rounded-lg bg-muted animate-pulse" />
        </div>
      </div>
    </div>
  );

  if (!request) return null;

  const currentStageIdx = STAGES.indexOf(request.status);
  const bestQuote = quotes.length > 0
    ? quotes.reduce((best, q) => q.unitPrice < best.unitPrice ? q : best, quotes[0])
    : null;

  return (
    <div className="space-y-8 pb-28">
      {/* Back */}
      <Button variant="ghost" size="sm" onClick={() => router.push('/requests')}
        className="text-muted-foreground hover:text-foreground -ml-2">
        <ArrowLeft className="size-4" /> Back to requests
      </Button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <PageHeader title={request.title} className="mb-0">
          <StatusBadge status={request.status} />
        </PageHeader>
        <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
          <span>Created {new Date(request.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          {request.quantity && <><Separator orientation="vertical" className="h-4" /><span>{request.quantity.toLocaleString()} {request.unit}</span></>}
          {request.productCategory && <><Separator orientation="vertical" className="h-4" /><span>{request.productCategory}</span></>}
        </div>
      </div>

      {/* Status Pipeline */}
      <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-full overflow-x-auto no-scrollbar">
        {STAGES.map((stage, i) => (
          <div key={stage} className={`flex-1 text-center py-2 px-3 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
            i < currentStageIdx
              ? 'bg-secondary/15 text-secondary'
              : i === currentStageIdx
              ? 'bg-primary text-primary-foreground shadow-lg'
              : 'text-muted-foreground/40'
          } ${i >= 5 ? 'hidden lg:flex' : ''} ${i >= 4 ? 'hidden md:flex' : ''}`}>
            {i < currentStageIdx && <Check className="size-3" />}
            {STAGE_LABELS[stage]}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="quotes">Quotes ({quotes.length})</TabsTrigger>
              <TabsTrigger value="compare" disabled={quotes.length < 2}>Compare</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Description */}
              {request.description && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="font-bold mb-3">Description</h2>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {request.description}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Specifications */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-bold mb-4">Specifications</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {request.quantity && (
                      <div className="rounded-xl bg-muted/50 p-4 border border-border">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Quantity</p>
                        <p className="text-xl font-bold">{request.quantity.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">{request.unit}</span></p>
                      </div>
                    )}
                    {request.targetPrice && (
                      <div className="rounded-xl bg-muted/50 p-4 border border-border">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Target Price</p>
                        <p className="text-xl font-bold">{fmt(request.targetPrice, request.targetCurrency)}</p>
                      </div>
                    )}
                    {request.productCategory && (
                      <div className="rounded-xl bg-muted/50 p-4 border border-border">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Category</p>
                        <p className="text-base font-bold uppercase">{request.productCategory}</p>
                      </div>
                    )}
                  </div>
                  {request.specifications && typeof request.specifications === 'object' && Object.keys(request.specifications as object).length > 0 && (
                    <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border">
                      {Object.entries(request.specifications as Record<string, string>)
                        .filter(([, v]) => v)
                        .map(([k, v]) => (
                          <div key={k} className="text-sm py-1">
                            <span className="text-muted-foreground capitalize">{k.replace(/_/g, ' ')}:</span>{' '}
                            <span className="font-medium">{String(v)}</span>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Quotes Tab */}
            <TabsContent value="quotes" className="space-y-4 mt-6">
              {quotes.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <CreditCard className="size-10 text-muted-foreground/30 mb-3" />
                    <p className="font-medium text-muted-foreground">No quotes yet</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">We&apos;re working on getting you competitive quotes</p>
                  </CardContent>
                </Card>
              ) : (
                quotes.map(quote => {
                  const isBest = bestQuote && quote.id === bestQuote.id;
                  return (
                    <Card key={quote.id} className={isBest ? 'border-l-4 border-l-secondary' : ''}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                              <Factory className="size-5 text-muted-foreground" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold">{quote.supplierName}</h3>
                                {isBest && <Badge className="bg-secondary text-secondary-foreground text-[10px]">Best Price</Badge>}
                              </div>
                              <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                                <Shield className="size-3" /> Verified Supplier
                              </div>
                              <div className="flex flex-wrap gap-1.5 mt-3">
                                {quote.paymentTerms && <Badge variant="outline" className="text-[10px]">{quote.paymentTerms}</Badge>}
                                {quote.leadTimeDays && <Badge variant="outline" className="text-[10px]">{quote.leadTimeDays} days</Badge>}
                                {quote.validUntil && <Badge variant="outline" className="text-[10px]">Valid {new Date(quote.validUntil).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Badge>}
                              </div>
                            </div>
                          </div>
                          <div className="md:text-right flex flex-col items-start md:items-end gap-1">
                            <p className="text-2xl font-black">{fmt(quote.unitPrice, quote.currency)} <span className="text-xs font-normal text-muted-foreground">/ unit</span></p>
                            {request.quantity && <p className="text-xs font-bold text-secondary uppercase">Total: {fmt(quote.unitPrice * request.quantity, quote.currency)}</p>}
                            <p className="text-[10px] text-muted-foreground">MOQ: {quote.moq.toLocaleString()} units</p>
                            <Button size="sm" variant={isBest ? 'default' : 'outline'} className="mt-2">
                              Accept Quote
                            </Button>
                          </div>
                        </div>
                        {quote.notes && (
                          <p className="text-sm text-muted-foreground mt-4 pt-4 border-t border-border">{quote.notes}</p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>

            {/* Compare Tab */}
            <TabsContent value="compare" className="mt-6">
              {quotes.length >= 2 && (
                <Card className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-1/4">Attributes</TableHead>
                          {quotes.map(q => (
                            <TableHead key={q.id}>
                              <div className="flex items-center gap-2">
                                <span className="font-bold">{q.supplierName}</span>
                                {bestQuote?.id === q.id && <Badge className="bg-secondary text-secondary-foreground text-[10px]">Best</Badge>}
                              </div>
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { label: 'Unit Price', render: (q: Quote) => fmt(q.unitPrice, q.currency), best: (q: Quote) => q.unitPrice === bestQuote?.unitPrice },
                          { label: 'MOQ', render: (q: Quote) => `${q.moq.toLocaleString()} pcs`, best: (q: Quote) => q.moq === Math.min(...quotes.map(x => x.moq)) },
                          { label: 'Lead Time', render: (q: Quote) => q.leadTimeDays ? `${q.leadTimeDays} days` : '—', best: (q: Quote) => q.leadTimeDays != null && q.leadTimeDays === Math.min(...quotes.filter(x => x.leadTimeDays != null).map(x => x.leadTimeDays!)) },
                          { label: 'Payment Terms', render: (q: Quote) => q.paymentTerms || '—' },
                          { label: 'Shipping Terms', render: (q: Quote) => q.shippingTerms || '—' },
                          { label: 'Valid Until', render: (q: Quote) => q.validUntil ? new Date(q.validUntil).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—' },
                        ].map(row => (
                          <TableRow key={row.label}>
                            <TableCell className="font-medium text-muted-foreground">{row.label}</TableCell>
                            {quotes.map(q => (
                              <TableCell key={q.id}>
                                <span className={row.best?.(q) ? 'font-bold bg-secondary/10 px-2 py-0.5 rounded' : ''}>
                                  {row.render(q)}
                                </span>
                                {row.best?.(q) && <Badge className="ml-2 bg-secondary text-secondary-foreground text-[9px]">Best</Badge>}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                        <TableRow className="font-bold">
                          <TableCell>Total at {request.quantity?.toLocaleString() || 'MOQ'} pcs</TableCell>
                          {quotes.map(q => {
                            const qty = request.quantity || q.moq;
                            const total = q.unitPrice * qty;
                            const isBest = q.id === bestQuote?.id;
                            return (
                              <TableCell key={q.id} className={isBest ? 'text-primary' : ''}>
                                {fmt(total, q.currency)}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Files */}
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-4">
              <CardTitle className="text-sm font-bold">Project Files</CardTitle>
              <span className="text-xs text-primary font-medium">{files.length} files</span>
            </CardHeader>
            <CardContent className="space-y-3">
              <label className={`flex flex-col items-center justify-center p-4 rounded-xl text-center border-2 border-dashed cursor-pointer transition-colors ${
                dragOver ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
              } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}>
                <Upload className="size-5 text-muted-foreground mb-1" />
                <p className="text-xs font-medium text-muted-foreground">
                  {dragOver ? 'Drop here' : uploading ? 'Uploading...' : 'Upload Files'}
                </p>
                <input type="file" onChange={uploadFile} className="hidden" multiple />
              </label>
              {files.map(f => (
                <a key={f.id} href={`/api/files/${f.id}`} target="_blank"
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/50 transition-colors group">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${f.mimeType.startsWith('image/') ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                      {f.mimeType.startsWith('image/') ? <ImageIcon className="size-4" /> : <FileText className="size-4" />}
                    </div>
                    <div>
                      <p className="text-xs font-medium">{f.originalName}</p>
                      <p className="text-[10px] text-muted-foreground">{(f.sizeBytes / 1024).toFixed(0)} KB</p>
                    </div>
                  </div>
                  <Download className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </CardContent>
          </Card>

          {/* Activity */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border">
                {activity.length > 0 ? activity.slice(0, 8).map((a, i) => (
                  <div key={a.id} className="relative pl-8">
                    <div className={`absolute left-0 top-1 w-6 h-6 rounded-full bg-background border-2 flex items-center justify-center z-10 ${
                      i === 0 ? 'border-primary' : 'border-border'}`}>
                      <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                    </div>
                    <p className={`text-xs font-medium ${i === 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {a.userName || 'System'} {a.action.replace(/_/g, ' ')}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">{timeAgo(a.createdAt)}</p>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground pl-8">No activity yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border py-3 px-6 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-4 text-xs">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-[10px] uppercase tracking-wider">Status</span>
              <span className="font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                {REQUEST_STATUS_LABELS[request.status]}
              </span>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <span className="text-muted-foreground"><span className="font-bold text-foreground">{quotes.length}</span> quote{quotes.length !== 1 ? 's' : ''} available</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Pencil className="size-3.5" /> Edit
            </Button>
            {quotes.length > 0 && (
              <Button size="sm">
                <CheckCircle className="size-3.5" /> Select Best Quote
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

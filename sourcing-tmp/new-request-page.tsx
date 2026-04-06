'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, ChevronRight, Send, Loader2, Info } from 'lucide-react';

import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const STEPS = ['Basic Info', 'Specifications', 'Review & Submit'];

interface FormData {
  title: string; description: string; productCategory: string;
  quantity: string; unit: string; targetPrice: string; targetCurrency: string;
  priority: string; material: string; size: string; color: string;
  packaging: string; certification: string; customSpecs: string; notes: string;
}

const CATEGORIES = [
  'Consumer Electronics', 'Packaging & Printing', 'Metal Parts (CNC/Stamping)',
  'Plastic Parts (Injection)', 'Textiles & Apparel', 'Home & Garden',
  'Automotive Parts', 'Medical Devices', 'Food & Beverage', 'Promotional Items',
  'PCB / Electronics', 'Furniture', 'Other',
];
const UNITS = ['pcs', 'sets', 'pairs', 'boxes', 'rolls', 'meters', 'kg', 'tons'];
const CURRENCIES = ['USD', 'CNY', 'EUR'];
const PRIORITIES = ['low', 'normal', 'high', 'urgent'];

const priorityBadge: Record<string, string> = {
  low: 'bg-muted text-muted-foreground',
  normal: 'bg-primary/10 text-primary',
  high: 'bg-amber-500/10 text-amber-400',
  urgent: 'bg-destructive/10 text-destructive',
};

export default function NewRequestPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<FormData>({
    title: '', description: '', productCategory: '', quantity: '', unit: 'pcs',
    targetPrice: '', targetCurrency: 'USD', priority: 'normal',
    material: '', size: '', color: '', packaging: '', certification: '',
    customSpecs: '', notes: '',
  });

  const update = (field: keyof FormData, value: string) =>
    setForm(f => ({ ...f, [field]: value }));
  const canProceed = () => step === 0 ? form.title.trim().length > 0 : true;

  const handleSubmit = async () => {
    setSubmitting(true); setError('');
    try {
      const specs: Record<string, string> = {};
      if (form.material) specs.material = form.material;
      if (form.size) specs.size = form.size;
      if (form.color) specs.color = form.color;
      if (form.packaging) specs.packaging = form.packaging;
      if (form.certification) specs.certification = form.certification;
      if (form.customSpecs) specs.custom_specs = form.customSpecs;

      const res = await fetch('/api/requests', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title, description: form.description,
          productCategory: form.productCategory,
          quantity: form.quantity ? parseInt(form.quantity) : undefined,
          unit: form.unit,
          targetPrice: form.targetPrice ? parseFloat(form.targetPrice) : undefined,
          targetCurrency: form.targetCurrency, priority: form.priority,
          specifications: Object.keys(specs).length > 0 ? specs : undefined,
        }),
      });
      const data = await res.json();
      if (data.ok) router.push(`/requests/${data.data.id}`);
      else setError(data.error || 'Failed to create request');
    } catch { setError('Connection error'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="space-y-8 pb-28">
      <Button variant="ghost" size="sm" onClick={() => router.push('/requests')}
        className="text-muted-foreground hover:text-foreground -ml-2">
        <ArrowLeft className="size-4" /> Back to requests
      </Button>

      <PageHeader title="New Sourcing Request"
        description="Tell us what you need, and we'll connect you with the best suppliers." />

      {/* Step Indicator */}
      <div className="relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted rounded-full">
          <div className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
        <div className="relative flex justify-between">
          {STEPS.map((s, i) => (
            <button key={s} onClick={() => i < step && setStep(i)} disabled={i > step}
              className={`flex flex-col items-center gap-2 ${i < step ? 'cursor-pointer' : 'cursor-default'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                i < step ? 'border-secondary bg-secondary/10 text-secondary'
                  : i === step ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-muted text-muted-foreground/40'}`}>
                {i < step ? <Check className="size-4" /> : <span className="text-sm font-bold">{i + 1}</span>}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${i <= step ? 'text-foreground' : 'text-muted-foreground/40'}`}>
                {s}
              </span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive flex items-center gap-2">
          <Info className="size-4 shrink-0" /> {error}
        </div>
      )}

      <Card>
        <CardContent className="p-6 md:p-10">

          {/* Step 0: Basic Info */}
          {step === 0 && (
            <div className="space-y-6 fade-in">
              <div>
                <h2 className="text-xl font-bold mb-1">Basic Information</h2>
                <p className="text-sm text-muted-foreground">Tell us about the product you're looking to source.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Product Name <span className="text-primary">*</span></Label>
                <Input id="title" value={form.title} onChange={e => update('title', e.target.value)}
                  placeholder="e.g. Custom Stainless Steel Water Bottles" autoFocus />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea id="desc" value={form.description} onChange={e => update('description', e.target.value)}
                  rows={4} placeholder="Describe what you're looking for in detail..." />
              </div>
              <div className="space-y-2">
                <Label>Product Category</Label>
                <Select value={form.productCategory} onValueChange={v => update('productCategory', v)}>
                  <SelectTrigger><SelectValue placeholder="Select a category..." /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="qty">Quantity</Label>
                  <Input id="qty" type="number" value={form.quantity} onChange={e => update('quantity', e.target.value)} placeholder="1000" />
                </div>
                <div className="space-y-2">
                  <Label>Unit</Label>
                  <Select value={form.unit} onValueChange={v => update('unit', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{UNITS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={form.priority} onValueChange={v => update('priority', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{PRIORITIES.map(p => <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Target Price</Label>
                  <Input id="price" type="number" step="0.01" value={form.targetPrice} onChange={e => update('targetPrice', e.target.value)} placeholder="2.50" />
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={form.targetCurrency} onValueChange={v => update('targetCurrency', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Specifications */}
          {step === 1 && (
            <div className="space-y-6 fade-in">
              <div>
                <h2 className="text-xl font-bold mb-1">Specifications</h2>
                <p className="text-sm text-muted-foreground">Add specific requirements. All fields optional.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="mat">Material</Label><Input id="mat" value={form.material} onChange={e => update('material', e.target.value)} placeholder="e.g. Brushed Aluminum" /></div>
                <div className="space-y-2"><Label htmlFor="sz">Size / Dimensions</Label><Input id="sz" value={form.size} onChange={e => update('size', e.target.value)} placeholder="e.g. 150cm x 200cm" /></div>
                <div className="space-y-2"><Label htmlFor="clr">Color</Label><Input id="clr" value={form.color} onChange={e => update('color', e.target.value)} placeholder="e.g. Midnight Navy" /></div>
                <div className="space-y-2"><Label htmlFor="pkg">Packaging</Label><Input id="pkg" value={form.packaging} onChange={e => update('packaging', e.target.value)} placeholder="e.g. Eco-friendly" /></div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cert">Certifications</Label>
                <Input id="cert" value={form.certification} onChange={e => update('certification', e.target.value)} placeholder="e.g. ISO 9001, Fair Trade" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cspec">Additional Specifications</Label>
                <Textarea id="cspec" value={form.customSpecs} onChange={e => update('customSpecs', e.target.value)} rows={4} placeholder="Describe any technical nuances..." />
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="notes">Internal Notes</Label>
                  <Badge variant="outline" className="text-[10px] font-medium">Private</Badge>
                </div>
                <Textarea id="notes" value={form.notes} onChange={e => update('notes', e.target.value)} rows={3}
                  placeholder="Notes for your internal procurement team. Not shared with suppliers." />
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div className="space-y-6 fade-in">
              <div>
                <h2 className="text-xl font-bold mb-1">Review & Submit</h2>
                <p className="text-sm text-muted-foreground">Verify your request details before submitting.</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary"><Check className="size-5" /></div>
                  <h3 className="text-lg font-bold">Request Summary</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <span className="text-muted-foreground">Product:</span><span className="font-medium">{form.title}</span>
                  {form.description && <><span className="text-muted-foreground">Description:</span><span className="text-muted-foreground">{form.description}</span></>}
                  {form.productCategory && <><span className="text-muted-foreground">Category:</span><span>{form.productCategory}</span></>}
                  {form.quantity && <><span className="text-muted-foreground">Quantity:</span><span className="font-medium">{form.quantity} {form.unit}</span></>}
                  {form.targetPrice && <><span className="text-muted-foreground">Target Price:</span><span className="font-medium">{form.targetCurrency} {form.targetPrice}</span></>}
                  <span className="text-muted-foreground">Priority:</span>
                  <span><Badge variant="outline" className={priorityBadge[form.priority]}>{form.priority.charAt(0).toUpperCase() + form.priority.slice(1)}</Badge></span>
                </div>
                {(form.material || form.size || form.color || form.packaging || form.certification) && (
                  <>
                    <Separator />
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Specifications</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {form.material && <><span className="text-muted-foreground">Material:</span><span>{form.material}</span></>}
                      {form.size && <><span className="text-muted-foreground">Size:</span><span>{form.size}</span></>}
                      {form.color && <><span className="text-muted-foreground">Color:</span><span>{form.color}</span></>}
                      {form.packaging && <><span className="text-muted-foreground">Packaging:</span><span>{form.packaging}</span></>}
                      {form.certification && <><span className="text-muted-foreground">Certifications:</span><span>{form.certification}</span></>}
                    </div>
                  </>
                )}
              </div>
              <div className="rounded-lg border border-primary/10 bg-primary/5 p-4 flex gap-3">
                <Info className="size-5 text-primary shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <strong className="text-foreground">What happens next?</strong> Our team will review your request and contact suppliers. You&apos;ll receive competitive quotes within 48 hours.
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sticky Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border py-4 px-6 z-40">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          {step > 0
            ? <Button variant="outline" onClick={() => setStep(s => s - 1)}><ArrowLeft className="size-4" /> Back</Button>
            : <Button variant="outline" onClick={() => router.push('/requests')}>Cancel</Button>}
          {step < 2
            ? <Button onClick={() => setStep(s => s + 1)} disabled={!canProceed()}>Continue <ChevronRight className="size-4" /></Button>
            : <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                Submit Request
              </Button>}
        </div>
      </div>
    </div>
  );
}

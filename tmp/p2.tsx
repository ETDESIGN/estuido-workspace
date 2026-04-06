'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, ArrowRight, Check, Send, Loader2,
  Info, Eye,
} from 'lucide-react';

import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const STEPS = ['Basic Info', 'Specifications', 'Review & Submit'];

interface FormData {
  title: string;
  description: string;
  productCategory: string;
  quantity: string;
  unit: string;
  targetPrice: string;
  targetCurrency: string;
  priority: string;
  material: string;
  size: string;
  color: string;
  packaging: string;
  certification: string;
  customSpecs: string;
  notes: string;
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

const priorityBadgeClass: Record<string, string> = {
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
    material: '', size: '', color: '', packaging: '', certification: '', customSpecs: '', notes: '',
  });

  const update = (field: keyof FormData, value: string) => setForm(f => ({ ...f, [field]: value }));
  const canProceed = () => step === 0 ? form.title.trim().length > 0 : true;

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const specs: Record<string, string> = {};
      if (form.material) specs.material = form.material;
      if (form.size) specs.size = form.size;
      if (form.color) specs.color = form.color;
      if (form.packaging) specs.packaging = form.packaging;
      if (form.certification) specs.certification = form.certification;
      if (form.customSpecs) specs.custom_specs = form.customSpecs;

      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          productCategory: form.productCategory,
          quantity: form.quantity ? parseInt(form.quantity) : undefined,
          unit: form.unit,
          targetPrice: form.targetPrice ? parseFloat(form.targetPrice) : undefined,
          targetCurrency: form.targetCurrency,
          priority: form.priority,
          specifications: Object.keys(specs).length > 0 ? specs : undefined,
        }),
      });
      const data = await res.json();
      if (data.ok) router.push(`/requests/${data.data.id}`);
      else setError(data.error || 'Failed to create request');
    } catch {
      setError('Connection error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-32">
      {/* Back Navigation */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push('/requests')}
        className="text-muted-foreground hover:text-foreground -ml-2"
      >
        <ArrowLeft className="size-4" />
        Back to requests
      </Button>

      {/* Header */}
      <PageHeader
        title="New Sourcing Request"
        description="Tell us what you need, and we will connect you with the best suppliers."
      />

      {/* Step Indicator */}
      <div className="space-y-6">
        <div className="relative w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-primary transition-all duration-500 ease-out rounded-full"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {STEPS.map((s, i) => (
            <button
              key={s}
              onClick={() => i < step && setStep(i)}
              disabled={i > step}
              className="flex flex-col items-center gap-2"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                  i < step
                    ? 'border-2 border-primary bg-primary/10 text-primary'
                    : i === step
                    ? 'bg-primary text-primary-foreground font-bold'
                    : 'border-2 border-border text-muted-foreground opacity-40'
                }`}
              >
                {i < step ? (
                  <Check className="size-5" />
                ) : (
                  <span className="text-sm font-bold">{i + 1}</span>
                )}
              </div>
              <span className={`text-xs font-semibold tracking-wide uppercase ${
                i <= step ? 'text-foreground' : 'text-muted-foreground'
              }`}>{s}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive flex items-center gap-2">
          <Info className="size-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Form Card */}
      <Card>
        <CardContent className="p-6 md:p-8 space-y-8">
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Basic Information</h2>
                <p className="text-sm text-muted-foreground">Tell us about the product you are looking to source.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">
                  Product Name <span className="text-primary">*</span>
                </Label>
                <Input id="title" value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Custom Stainless Steel Water Bottles" autoFocus />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={form.description} onChange={(e) => update('description', e.target.value)} rows={4} placeholder="Describe what you are looking for in detail..." />
              </div>

              <div className="space-y-2">
                <Label>Product Category</Label>
                <Select value={form.productCategory} onValueChange={(v) => update('productCategory', v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" type="number" value={form.quantity} onChange={(e) => update('quantity', e.target.value)} placeholder="1000" />
                </div>
                <div className="space-y-2">
                  <Label>Unit</Label>
                  <Select value={form.unit} onValueChange={(v) => update('unit', v)}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {UNITS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={form.priority} onValueChange={(v) => update('priority', v)}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map((p) => (
                        <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="targetPrice">Target Price</Label>
                  <Input id="targetPrice" type="number" step="0.01" value={form.targetPrice} onChange={(e) => update('targetPrice', e.target.value)} placeholder="2.50" />
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={form.targetCurrency} onValueChange={(v) => update('targetCurrency', v)}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Specifications</h2>
                <p className="text-sm text-muted-foreground">Add specific requirements. All fields optional.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="material">Material</Label>
                  <Input id="material" value={form.material} onChange={(e) => update('material', e.target.value)} placeholder="e.g. Brushed Aluminum, Organic Cotton" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Size / Dimensions</Label>
                  <Input id="size" value={form.size} onChange={(e) => update('size', e.target.value)} placeholder="e.g. 150cm x 200cm, standard A4" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input id="color" value={form.color} onChange={(e) => update('color', e.target.value)} placeholder="e.g. Midnight Navy, Pantone 19-4052" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="packaging">Packaging</Label>
                  <Input id="packaging" value={form.packaging} onChange={(e) => update('packaging', e.target.value)} placeholder="e.g. Eco-friendly, Retail Ready" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="certification">Certifications</Label>
                <Input id="certification" value={form.certification} onChange={(e) => update('certification', e.target.value)} placeholder="e.g. ISO 9001, Fair Trade, OEKO-TEX" />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="customSpecs">Additional Specifications</Label>
                <Textarea id="customSpecs" value={form.customSpecs} onChange={(e) => update('customSpecs', e.target.value)} rows={4} placeholder="Describe any technical nuances, finishing requirements, or quality benchmarks..." />
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="notes">Internal Notes</Label>
                  <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">Private</Badge>
                </div>
                <Textarea id="notes" value={form.notes} onChange={(e) => update('notes', e.target.value)} rows={3} placeholder="Notes for your internal procurement team. These will not be shared with suppliers." />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Review and Submit</h2>
                <p className="text-sm text-muted-foreground">Verify your request details before submitting.</p>
              </div>

              <div className="rounded-lg border border-border p-6 space-y-4 bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Eye className="size-5" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">Request Summary</h3>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-muted-foreground">Product:</div>
                  <div className="font-medium text-foreground">{form.title}</div>
                  {form.description && (<>
                    <div className="text-muted-foreground">Description:</div>
                    <div className="text-foreground text-sm">{form.description}</div>
                  </>)}
                  {form.productCategory && (<>
                    <div className="text-muted-foreground">Category:</div>
                    <div className="text-foreground">{form.productCategory}</div>
                  </>)}
                  {form.quantity && (<>
                    <div className="text-muted-foreground">Quantity:</div>
                    <div className="font-medium text-foreground">{form.quantity} {form.unit}</div>
                  </>)}
                  {form.targetPrice && (<>
                    <div className="text-muted-foreground">Target Price:</div>
                    <div className="font-medium text-foreground">{form.targetCurrency} {form.targetPrice}</div>
                  </>)}
                  <div className="text-muted-foreground">Priority:</div>
                  <div>
                    <Badge variant="outline" className={priorityBadgeClass[form.priority] ?? priorityBadgeClass.normal}>
                      {form.priority.charAt(0).toUpperCase() + form.priority.slice(1)}
                    </Badge>
                  </div>
                </div>

                {(form.material || form.size || form.color || form.packaging || form.certification) && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Specifications</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {form.material && (<><span className="text-muted-foreground">Material:</span><span className="text-foreground">{form.material}</span></>)}
                        {form.size && (<><span className="text-muted-foreground">Size:</span><span className="text-foreground">{form.size}</span></>)}
                        {form.color && (<><span className="text-muted-foreground">Color:</span><span className="text-foreground">{form.color}</span></>)}
                        {form.packaging && (<><span className="text-muted-foreground">Packaging:</span><span className="text-foreground">{form.packaging}</span></>)}
                        {form.certification && (<><span className="text-muted-foreground">Certifications:</span><span className="text-foreground">{form.certification}</span></>)}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 flex gap-3">
                <Info className="text-primary size-5 mt-0.5 shrink-0" />
                <div className="text-sm text-muted-foreground">
                  <strong className="text-foreground">What happens next?</strong> Our team will review your request and contact suppliers. You will receive competitive quotes within 48 hours.
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sticky Bottom Wizard Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border py-4 px-6 z-40">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          {step > 0 ? (
            <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
              <ArrowLeft className="size-4" />
              Back
            </Button>
          ) : (
            <Button variant="outline" onClick={() => router.push('/requests')}>
              Cancel
            </Button>
          )}
          {step < 2 ? (
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canProceed()}>
              Continue
              <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              Submit Request
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

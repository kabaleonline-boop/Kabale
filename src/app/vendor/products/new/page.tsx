'use client';

import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { 
  UploadCloud, X, Loader2, ArrowLeft, CheckCircle, Plus, 
  ShoppingBag, Wrench, Phone, MessageSquare, MapPin, Clock 
} from 'lucide-react';
import Link from 'next/link';

export default function DualPostingPage() {
  const { user } = useAuth();

  const [type, setType] = useState<'product' | 'service'>('product');
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const initialFormState = {
    title: '',
    brand: '',
    category: '',
    description: '',
    price: '',
    priceType: 'fixed', // 'fixed' | 'starting' | 'per_hour'
    stock: '1',
    images: [] as string[],
    phone: '',
    whatsappNumber: '',
    location: 'Kabale Town',
    duration: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  // Handle Cloudinary Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingImages(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of files) {
        const signResponse = await fetch('/api/cloudinary/sign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ folder: `kabale_marketplace/${type}s` }),
        });

        if (!signResponse.ok) throw new Error('Signature generation failed');
        const { signature, timestamp, folder, cloudName, apiKey } = await signResponse.json();

        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('api_key', apiKey);
        uploadData.append('timestamp', timestamp.toString());
        uploadData.append('signature', signature);
        uploadData.append('folder', folder);

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: uploadData,
        });

        const data = await uploadRes.json();
        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        }
      }

      setFormData(prev => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
    } catch (error: any) {
      console.error('Image upload failed:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== indexToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("Please log in to publish a listing.");
    if (formData.images.length === 0) return alert("Please upload at least one cover image or photo.");

    setSaving(true);
    try {
      // 1. Ensure user has seller flag enabled on their profile
      await setDoc(doc(db, 'users', user.uid), {
        isSeller: true,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      const payload = {
        type, // 'product' or 'service'
        name: formData.title,
        title: formData.title,
        brand: formData.brand || '',
        category: formData.category,
        description: formData.description,
        price: Number(formData.price),
        priceType: type === 'service' ? formData.priceType : 'fixed',
        stock: type === 'product' ? Number(formData.stock) : 0,
        images: formData.images,
        coverImage: formData.images[0] || '',
        phone: formData.phone || '',
        whatsappNumber: formData.whatsappNumber || formData.phone || '',
        location: formData.location || 'Kabale Town',
        duration: type === 'service' ? formData.duration : '',
        sellerId: user.uid,
        ownerId: user.uid,
        sellerName: user.displayName || user.email?.split('@')[0] || 'Kabale User',
        verified: true,
      };

      // 2. Add document to Firestore
      const docRef = await addDoc(collection(db, 'products'), {
        ...payload,
        createdAt: serverTimestamp(),
      });

      // 3. Sync to Algolia
      try {
        const idToken = await user.getIdToken();
        await fetch('/api/algolia/sync', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}` 
          },
          body: JSON.stringify({ 
            action: 'CREATE',
            product: { id: docRef.id, ...payload } 
          })
        });
      } catch (algoliaError) {
        console.error("Algolia sync skipped:", algoliaError);
      }

      setSaving(false);
      setIsSuccess(true);
    } catch (error: any) {
      console.error("Failed to create listing:", error);
      alert("Failed to publish listing: " + error.message);
      setSaving(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="p-4 md:p-8 max-w-lg mx-auto flex flex-col items-center text-center mt-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <CheckCircle className="h-16 w-16 text-emerald-500 mb-4" />
        <h2 className="text-2xl font-black text-gray-900 mb-2">
          {type === 'service' ? 'Service Listed!' : 'Product Published!'}
        </h2>
        <p className="text-gray-500 mb-8 font-medium">
          Your listing is live and visible to all shoppers across Kabale.
        </p>
        
        <div className="w-full flex flex-col gap-3">
          <button 
            onClick={() => { setFormData(initialFormState); setIsSuccess(false); }}
            className="w-full bg-[#0b79bf] text-white px-6 py-3.5 rounded-xl font-bold shadow-sm hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <Plus className="h-5 w-5" /> Post Another Item
          </button>
          <Link 
            href={type === 'service' ? '/services' : '/products'}
            className="w-full bg-gray-50 text-gray-700 border border-gray-200 px-6 py-3.5 rounded-xl font-bold hover:bg-gray-100 transition text-center"
          >
            View Live Listing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/vendor/products" className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Create New Listing</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Post a physical product or offer a service in Kabale.</p>
        </div>
      </div>

      {/* LISTING TYPE SELECTOR */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Select Listing Type</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          <button
            type="button"
            onClick={() => setType('product')}
            className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition ${
              type === 'product'
                ? 'border-[#0b79bf] bg-blue-50/60 text-gray-900 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-gray-50/50'
            }`}
          >
            <div className={`p-2.5 rounded-lg shrink-0 ${type === 'product' ? 'bg-[#0b79bf] text-white' : 'bg-gray-200 text-gray-600'}`}>
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Physical Product</h3>
              <p className="text-xs text-gray-500 mt-0.5">Appears in 2-column mobile grid with Add to Cart and checkout features.</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setType('service')}
            className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition ${
              type === 'service'
                ? 'border-[#0b79bf] bg-blue-50/60 text-gray-900 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-gray-50/50'
            }`}
          >
            <div className={`p-2.5 rounded-lg shrink-0 ${type === 'service' ? 'bg-[#0b79bf] text-white' : 'bg-gray-200 text-gray-600'}`}>
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Service / Skill</h3>
              <p className="text-xs text-gray-500 mt-0.5">Appears in full edge-to-edge layout with instant WhatsApp/Call booking.</p>
            </div>
          </button>

        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              {type === 'service' ? 'Service Information' : 'Product Information'}
            </h2>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {type === 'service' ? 'Service Title *' : 'Product Name *'}
              </label>
              <input 
                required 
                type="text" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:bg-white focus:border-[#0b79bf] outline-none transition" 
                placeholder={type === 'service' ? 'e.g. Professional Laptop & Phone Repair' : 'e.g. Samsung Galaxy A14 64GB'} 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Category *</label>
                <select 
                  required 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none bg-white focus:border-[#0b79bf]"
                >
                  <option value="">Select a category...</option>
                  {type === 'service' ? (
                    <>
                      <option value="Tech & Repairs">Tech & Repairs</option>
                      <option value="Salon & Beauty">Salon & Beauty</option>
                      <option value="Cleaning & Laundry">Cleaning & Laundry</option>
                      <option value="Catering & Bakes">Catering & Bakes</option>
                      <option value="Electrical & Plumbing">Electrical & Plumbing</option>
                      <option value="Photography & Video">Photography & Video</option>
                      <option value="Transport & Logistics">Transport & Logistics</option>
                      <option value="Other Services">Other Services</option>
                    </>
                  ) : (
                    <>
                      <option value="Electronics">Electronics</option>
                      <option value="Fashion & Apparel">Fashion & Apparel</option>
                      <option value="Home & Kitchen">Home & Kitchen</option>
                      <option value="Health & Beauty">Health & Beauty</option>
                      <option value="Hardware & Tools">Hardware & Tools</option>
                      <option value="General / Supermarket">General / Supermarket</option>
                      <option value="Agriculture">Agriculture</option>
                      <option value="Other">Other</option>
                    </>
                  )}
                </select>
              </div>

              {type === 'product' && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Brand (Optional)</label>
                  <input 
                    type="text" 
                    value={formData.brand} 
                    onChange={e => setFormData({...formData, brand: e.target.value})} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:bg-white focus:border-[#0b79bf] outline-none transition" 
                    placeholder="e.g. Apple, Nike, Sony" 
                  />
                </div>
              )}

              {type === 'service' && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Location / Area</label>
                  <input 
                    type="text" 
                    value={formData.location} 
                    onChange={e => setFormData({...formData, location: e.target.value})} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:bg-white focus:border-[#0b79bf] outline-none transition" 
                    placeholder="e.g. Central Market, Kabale Town" 
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Description *</label>
              <textarea 
                required 
                rows={4} 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:bg-white focus:border-[#0b79bf] outline-none transition resize-none" 
                placeholder={type === 'service' ? 'Explain what is included in your service...' : 'Describe the condition, key specs, and warranty...'}
              />
            </div>

            {type === 'service' && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Estimated Duration (Optional)</label>
                <input 
                  type="text" 
                  value={formData.duration} 
                  onChange={e => setFormData({...formData, duration: e.target.value})} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:bg-white focus:border-[#0b79bf] outline-none transition" 
                  placeholder="e.g. 1 - 2 Hours, Same Day Service" 
                />
              </div>
            )}
          </div>

          {/* Pricing & Contact Block */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              Pricing & Contact Setup
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Price (UGX) *</label>
                <input 
                  required 
                  type="number" 
                  min="0" 
                  value={formData.price} 
                  onChange={e => setFormData({...formData, price: e.target.value})} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:bg-white focus:border-[#0b79bf] outline-none transition" 
                  placeholder="25000" 
                />
              </div>

              {type === 'service' ? (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Pricing Model *</label>
                  <select 
                    value={formData.priceType} 
                    onChange={e => setFormData({...formData, priceType: e.target.value})} 
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none bg-white focus:border-[#0b79bf]"
                  >
                    <option value="fixed">Fixed Price</option>
                    <option value="starting">Starting From</option>
                    <option value="per_hour">Per Hour</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Stock Quantity *</label>
                  <input 
                    required 
                    type="number" 
                    min="1" 
                    value={formData.stock} 
                    onChange={e => setFormData({...formData, stock: e.target.value})} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:bg-white focus:border-[#0b79bf] outline-none transition" 
                    placeholder="1" 
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number for Calls *</label>
                <input 
                  required 
                  type="text" 
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value})} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:bg-white focus:border-[#0b79bf] outline-none transition" 
                  placeholder="e.g. 0770000000" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">WhatsApp Number (Optional)</label>
                <input 
                  type="text" 
                  value={formData.whatsappNumber} 
                  onChange={e => setFormData({...formData, whatsappNumber: e.target.value})} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:bg-white focus:border-[#0b79bf] outline-none transition" 
                  placeholder="Defaults to phone number" 
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Media Upload & Actions */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-1">
              {type === 'service' ? 'Banner / Photos *' : 'Product Photos *'}
            </h2>
            <p className="text-xs text-gray-500 mb-4 font-medium">
              {type === 'service' 
                ? 'Upload clear work samples or a banner. First photo is used as cover.' 
                : 'Upload up to 5 clear photos. First image is the main cover.'}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {formData.images.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-lg border border-gray-200 overflow-hidden group bg-gray-50 p-1">
                  <img src={url} alt={`Upload ${i}`} className="w-full h-full object-cover rounded" />
                  <button 
                    type="button" 
                    onClick={() => removeImage(i)} 
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow-md"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-0 left-0 w-full bg-black/70 text-white text-[10px] font-bold text-center py-0.5">
                      COVER
                    </span>
                  )}
                </div>
              ))}

              {formData.images.length < 5 && (
                <label className="relative aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition group">
                  {uploadingImages ? (
                    <Loader2 className="h-6 w-6 text-[#0b79bf] animate-spin" />
                  ) : (
                    <>
                      <UploadCloud className="h-6 w-6 text-gray-400 mb-1 group-hover:text-[#0b79bf] transition" />
                      <span className="text-[10px] font-bold text-gray-500 group-hover:text-[#0b79bf]">Add Image</span>
                    </>
                  )}
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageUpload} 
                    disabled={uploadingImages} 
                  />
                </label>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={saving || uploadingImages}
            className="w-full bg-[#0b79bf] text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-blue-700 transition disabled:opacity-50 flex justify-center items-center gap-2 text-base"
          >
            {saving && <Loader2 className="h-5 w-5 animate-spin" />}
            {saving ? 'Publishing...' : type === 'service' ? 'Publish Service Now' : 'Publish Product Now'}
          </button>
        </div>

      </form>

    </div>
  );
}

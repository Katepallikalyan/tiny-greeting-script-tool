
import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Image, Video } from "lucide-react";

interface UploadData {
  name: string;
  quality: string;
  quantity: string;
  price: string;
  image: File | null;
  video: File | null;
}

interface UploadCropFormProps {
  existingCrops: { name: string }[];
  onCropAdded: (crop: UploadData) => void;
}

const UploadCropForm: React.FC<UploadCropFormProps> = ({ existingCrops, onCropAdded }) => {
  const [form, setForm] = useState<UploadData>({
    name: "",
    quality: "",
    quantity: "",
    price: "",
    image: null,
    video: null,
  });
  const [errors, setErrors] = useState<string | null>(null);
  const imgRef = useRef<HTMLInputElement>(null);
  const vidRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setForm(f => ({ ...f, [name]: files[0] }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
    setErrors(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic check for duplicate crop name
    if (existingCrops.some(crop => crop.name.trim().toLowerCase() === form.name.trim().toLowerCase())) {
      setErrors("Crop with this name already exists!");
      return;
    }
    if (!form.name || !form.quality || !form.quantity || !form.price || !form.image) {
      setErrors("Please fill all required fields and upload an image.");
      return;
    }
    onCropAdded(form);
    setForm({
      name: "",
      quality: "",
      quantity: "",
      price: "",
      image: null,
      video: null,
    });
    if (imgRef.current) imgRef.current.value = "";
    if (vidRef.current) vidRef.current.value = "";
    setErrors(null);
  };

  return (
    <form className="bg-white p-4 rounded-xl shadow space-y-3 mt-2" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Crop Name</Label>
        <Input id="name" name="name" placeholder="e.g. Wheat" value={form.name} onChange={handleChange} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="quality">Quality</Label>
        <Input id="quality" name="quality" placeholder="e.g. A Grade, Organic" value={form.quality} onChange={handleChange} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input id="quantity" name="quantity" placeholder="e.g. 100 kg" value={form.quantity} onChange={handleChange} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="price">Price per Unit</Label>
        <Input id="price" name="price" placeholder="e.g. ₹25/kg" value={form.price} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="image">Image (required)</Label>
        <div className="flex items-center gap-2">
          <Input id="image" name="image" type="file" accept="image/*" ref={imgRef} onChange={handleChange} className="flex-1" />
          <Image className="w-5 h-5 text-gray-600" />
        </div>
      </div>
      <div>
        <Label htmlFor="video">Video (optional)</Label>
        <div className="flex items-center gap-2">
          <Input id="video" name="video" type="file" accept="video/*" ref={vidRef} onChange={handleChange} className="flex-1" />
          <Video className="w-5 h-5 text-gray-600" />
        </div>
      </div>
      {errors && <div className="text-xs text-red-600">{errors}</div>}
      <Button type="submit" className="w-full bg-green-700 text-white rounded-lg mt-2">Upload Crop</Button>
    </form>
  );
};

export default UploadCropForm;

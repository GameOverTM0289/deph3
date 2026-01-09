import Image from 'next/image';
import { GALLERY_IMAGES } from '@/lib/utils';

export default function GalleryPage() {
  return (
    <>
      <section className="bg-sand-50 pt-32 pb-14"><div className="container-custom text-center fade-up"><h1 className="heading-1 mb-2">Gallery</h1><p className="text-gray-500">Mediterranean inspiration</p></div></section>
      <section className="py-14"><div className="container-custom"><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">{GALLERY_IMAGES.map((img, i) => (<div key={i} className={`relative aspect-square overflow-hidden img-zoom fade-up delay-${Math.min(i, 5)}`}><Image src={img} alt={`Gallery ${i + 1}`} fill className="object-cover" /></div>))}</div></div></section>
    </>
  );
}

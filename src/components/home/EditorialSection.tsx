import Image from 'next/image';

export default function EditorialSection() {
  return (
    <section className="section bg-sand-50">
      <div className="container-custom">
        <div className="text-center mb-10 fade-up">
          <span className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-3 block">Editorial</span>
          <h2 className="heading-2">Mediterranean Spirit</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="relative aspect-[3/4] overflow-hidden img-zoom fade-up">
            <Image src="/images/products/yellow-simple-1.jpg" alt="Editorial" fill className="object-cover" />
          </div>
          <div className="relative aspect-[3/4] overflow-hidden img-zoom fade-up delay-1">
            <Image src="/images/products/blue-button-1.jpg" alt="Editorial" fill className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, MapPin, Phone, GraduationCap } from 'lucide-react';

export const metadata = {
  title: 'À propos — VetoVolaille',
  description: 'Cabinet vétérinaire familial depuis trois générations',
};

const vetImages = [
  {
    url: 'https://images.pexels.com/photos/32788235/pexels-photo-32788235.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Vétérinaire en blouse blanche',
    name: 'Dr. KONE',
    role: 'Père — Vétérinaire fondateur',
    desc: 'Plus de 30 ans d\'expérience en santé animale. Spécialiste de l\'élevage avicole et bovin.',
  },
  {
    url: 'https://images.pexels.com/photos/6235110/pexels-photo-6235110.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Vétérinaire examinant un animal',
    name: 'Dr. KONE Jr.',
    role: 'Fils — Vétérinaire',
    desc: 'Diplômé en médecine vétérinaire, spécialisé en aviculture et prophylaxie aviaire.',
  },
  {
    url: 'https://images.pexels.com/photos/32788234/pexels-photo-32788234.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Vétérinaire avec stéthoscope',
    name: 'Dr. KONE II',
    role: 'Fils — Vétérinaire',
    desc: 'Spécialisé en santé animale et suivi des élevages. Disponible pour vos consultations et urgences.',
  },
];

export default function AproposPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 text-9xl">🩺</div>
          <div className="absolute bottom-10 right-10 text-9xl">🐔</div>
        </div>
        <div className="container mx-auto px-4 lg:px-6 max-w-4xl text-center relative">
          <Badge variant="secondary" className="mb-4 px-4 py-1.5">
            <Stethoscope className="h-3.5 w-3.5 mr-1.5" />
            Depuis trois générations
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-balance" style={{ fontFamily: 'var(--font-poppins)' }}>
            Une famille de vétérinaires <span className="text-primary">au service de vos animaux</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Notre cabinet réunit un père et ses deux enfants vétérinaires, passionnés
            par la santé animale et l'élevage. Nous mettons notre expertise au service
            des éleveurs et propriétaires d'animaux de la région.
          </p>
        </div>
      </section>

      {/* Notre équipe avec photos */}
      <section className="container mx-auto px-4 lg:px-6 py-16 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-3" style={{ fontFamily: 'var(--font-poppins)' }}>
            Notre équipe vétérinaire
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Une passion transmise de père en fils, au service de la santé de vos animaux
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {vetImages.map((vet, idx) => (
            <div
              key={idx}
              className="group animate-slide-up"
              style={{ animationDelay: `${idx * 0.15}s` }}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg mb-4">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={vet.url}
                    alt={vet.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <GraduationCap className="h-4 w-4 text-primary-foreground/90" />
                    <span className="text-sm font-semibold">{vet.name}</span>
                  </div>
                  <p className="text-xs text-white/80">{vet.role}</p>
                </div>
              </div>
              <div className="px-1">
                <p className="text-sm text-muted-foreground leading-relaxed">{vet.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Notre histoire */}
      <section className="container mx-auto px-4 lg:px-6 py-16 max-w-3xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-poppins)' }}>
            Notre histoire
          </h2>
        </div>
        <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-primary/20">
          <div className="relative">
            <div className="absolute -left-[1.65rem] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
              1
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Tout a commencé avec notre père, vétérinaire passionné qui a consacré sa vie
              à la santé animale dans notre région. Il a transmis son savoir-faire et son
              amour des animaux à ses deux enfants.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -left-[1.65rem] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
              2
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Ses deux enfants ont suivi ses pas en devenant vétérinaires à leur tour.
              Aujourd'hui, notre cabinet familial réunit trois générations d'expertise,
              avec une spécialité dans l'élevage de volailles.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -left-[1.65rem] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
              3
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Notre mission: mettre notre expertise au service des éleveurs et propriétaires
              d'animaux. Avec notre nouvelle plateforme, commandez en ligne et recevez vos
              notifications directement sur WhatsApp.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-16">
        <div className="container mx-auto px-4 lg:px-6 max-w-2xl text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-poppins)' }}>
            Contactez-nous
          </h2>
          <p className="text-muted-foreground mb-8">
            Une question, un besoin, une urgence vétérinaire ? Nous sommes là pour vous.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Phone className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p className="font-medium">+225 00 00 00 00</p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <MapPin className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">Adresse</p>
                  <p className="font-medium">Cabinet vétérinaire, Côte d'Ivoire</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

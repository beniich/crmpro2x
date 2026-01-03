import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Shield, Zap, Users, ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();

  const services = [
    {
      icon: Cloud,
      title: t("home.services.items.cloud.title"),
      description: t("home.services.items.cloud.description")
    },
    {
      icon: Shield,
      title: t("home.services.items.security.title"),
      description: t("home.services.items.security.description")
    },
    {
      icon: Zap,
      title: t("home.services.items.performance.title"),
      description: t("home.services.items.performance.description")
    },
    {
      icon: Users,
      title: t("home.services.items.support.title"),
      description: t("home.services.items.support.description")
    }
  ];

  const testimonials = [
    {
      name: "Marie Dupont",
      company: "TechCorp",
      content: t("home.testimonials.items.0.content"),
      rating: 5
    },
    {
      name: "Jean Martin",
      company: "InnovateSAS",
      content: t("home.testimonials.items.1.content"),
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              {t("home.hero.title")}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("home.hero.subtitle")}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="gap-2">
                <Link to="/services">
                  {t("home.hero.cta.discover")} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/auth">{t("home.hero.cta.createAccount")}</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/contact">{t("home.hero.cta.contact")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("home.services.title")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("home.services.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-border/50">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
              <Link to="/services">{t("home.services.viewAll")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("home.testimonials.title")}
            </h2>
            <p className="text-muted-foreground">
              {t("home.testimonials.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border/50">
                <CardHeader>
                  <div className="flex gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <CardDescription>{testimonial.company}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;

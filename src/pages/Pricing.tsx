import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Building2, Crown, ArrowRight, MessageSquare, Brain, Eye, Calendar, Users, Shield, BarChart3, Settings, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  icon: React.ReactNode;
  highlighted: boolean;
  badge?: string;
  features: PlanFeature[];
  cta: string;
  ctaVariant: "default" | "outline" | "secondary";
}

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);
  const { t } = useTranslation();

  const plans: Plan[] = [
    {
      id: "free",
      name: t("pricing.plans.free.name"),
      description: t("pricing.plans.free.description"),
      monthlyPrice: 0,
      yearlyPrice: 0,
      icon: <Sparkles className="h-6 w-6" />,
      highlighted: false,
      features: [
        { text: t("pricing.plans.free.features.chat"), included: true },
        { text: t("pricing.plans.free.features.users"), included: true },
        { text: t("pricing.plans.free.features.process"), included: true },
        { text: t("pricing.plans.free.features.manufacturing"), included: true },
        { text: t("pricing.plans.free.features.support"), included: true },
        { text: t("pricing.plans.free.features.analysis"), included: false },
        { text: t("pricing.plans.free.features.vision"), included: false },
        { text: t("pricing.plans.free.features.erp"), included: false },
      ],
      cta: t("pricing.plans.free.cta"),
      ctaVariant: "outline",
    },
    {
      id: "pro",
      name: t("pricing.plans.pro.name"),
      description: t("pricing.plans.pro.description"),
      monthlyPrice: 49,
      yearlyPrice: 39,
      icon: <Zap className="h-6 w-6" />,
      highlighted: true,
      badge: t("pricing.plans.pro.badge"),
      features: [
        { text: t("pricing.plans.pro.features.chat"), included: true },
        { text: t("pricing.plans.pro.features.models"), included: true },
        { text: t("pricing.plans.pro.features.analysis"), included: true },
        { text: t("pricing.plans.pro.features.vision"), included: true },
        { text: t("pricing.plans.pro.features.planning"), included: true },
        { text: t("pricing.plans.pro.features.users"), included: true },
        { text: t("pricing.plans.pro.features.support"), included: true },
        { text: t("pricing.plans.pro.features.reports"), included: true },
        { text: t("pricing.plans.pro.features.erp"), included: true },
      ],
      cta: t("pricing.plans.pro.cta"),
      ctaVariant: "default",
    },
    {
      id: "business",
      name: t("pricing.plans.business.name"),
      description: t("pricing.plans.business.description"),
      monthlyPrice: 129,
      yearlyPrice: 99,
      icon: <Building2 className="h-6 w-6" />,
      highlighted: false,
      features: [
        { text: t("pricing.plans.business.features.pro"), included: true },
        { text: t("pricing.plans.business.features.multi"), included: true },
        { text: t("pricing.plans.business.features.oee"), included: true },
        { text: t("pricing.plans.business.features.maintenance"), included: true },
        { text: t("pricing.plans.business.features.api"), included: true },
        { text: t("pricing.plans.business.features.workers"), included: true },
        { text: t("pricing.plans.business.features.history"), included: true },
        { text: t("pricing.plans.business.features.rbac"), included: true },
        { text: t("pricing.plans.business.features.sso"), included: true },
      ],
      cta: t("pricing.plans.business.cta"),
      ctaVariant: "secondary",
    },
    {
      id: "enterprise",
      name: t("pricing.plans.enterprise.name"),
      description: t("pricing.plans.enterprise.description"),
      monthlyPrice: null,
      yearlyPrice: null,
      icon: <Crown className="h-6 w-6" />,
      highlighted: false,
      features: [
        { text: t("pricing.plans.enterprise.features.business"), included: true },
        { text: t("pricing.plans.enterprise.features.custom"), included: true },
        { text: t("pricing.plans.enterprise.features.machine"), included: true },
        { text: t("pricing.plans.enterprise.features.support"), included: true },
        { text: t("pricing.plans.enterprise.features.hosting"), included: true },
        { text: t("pricing.plans.enterprise.features.audit"), included: true },
        { text: t("pricing.plans.enterprise.features.mes"), included: true },
        { text: t("pricing.plans.enterprise.features.training"), included: true },
        { text: t("pricing.plans.enterprise.features.sla"), included: true },
      ],
      cta: t("pricing.plans.enterprise.cta"),
      ctaVariant: "outline",
    },
  ];

  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: t("pricing.featureItems.ai.title"),
      description: t("pricing.featureItems.ai.description"),
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: t("pricing.featureItems.planner.title"),
      description: t("pricing.featureItems.planner.description"),
    },
    {
      icon: <Settings className="h-8 w-8" />,
      title: t("pricing.featureItems.maintenance.title"),
      description: t("pricing.featureItems.maintenance.description"),
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: t("pricing.featureItems.kpi.title"),
      description: t("pricing.featureItems.kpi.description"),
    },
    {
      icon: <Eye className="h-8 w-8" />,
      title: t("pricing.featureItems.vision.title"),
      description: t("pricing.featureItems.vision.description"),
    },
    {
      icon: <Cpu className="h-8 w-8" />,
      title: t("pricing.featureItems.process.title"),
      description: t("pricing.featureItems.process.description"),
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: t("pricing.featureItems.security.title"),
      description: t("pricing.featureItems.security.description"),
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: t("pricing.featureItems.team.title"),
      description: t("pricing.featureItems.team.description"),
    },
  ];

  const faqs = [
    {
      question: t("pricing.faq.change.q"),
      answer: t("pricing.faq.change.a"),
    },
    {
      question: t("pricing.faq.trial.q"),
      answer: t("pricing.faq.trial.a"),
    },
    {
      question: t("pricing.faq.billing.q"),
      answer: t("pricing.faq.billing.a"),
    },
    {
      question: t("pricing.faq.erp.q"),
      answer: t("pricing.faq.erp.a"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              {t("pricing.badge")}
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              {t("pricing.heroTitle")}
              <span className="text-primary block mt-2">{t("pricing.heroTitleHighlight")}</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              {t("pricing.heroSubtitle")}
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className={`text-sm font-medium ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
                {t("pricing.monthly")}
              </span>
              <Switch
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
                className="data-[state=checked]:bg-primary"
              />
              <span className={`text-sm font-medium ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
                {t("pricing.yearly")}
              </span>
              {isAnnual && (
                <Badge variant="default" className="bg-success text-success-foreground">
                  {t("pricing.save20")}
                </Badge>
              )}
            </div>
          </motion.div>
        </section>

        {/* Pricing Cards */}
        <section className="container mx-auto px-4 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`
                  relative rounded-2xl p-6 
                  ${plan.highlighted
                    ? 'bg-primary text-primary-foreground shadow-xl scale-105 border-2 border-primary'
                    : 'bg-card shadow-neu border border-border'
                  }
                `}
              >
                {plan.badge && (
                  <Badge
                    className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground"
                  >
                    {plan.badge}
                  </Badge>
                )}

                <div className="mb-6">
                  <div className={`
                    inline-flex p-3 rounded-xl mb-4
                    ${plan.highlighted ? 'bg-primary-foreground/20' : 'bg-primary/10'}
                  `}>
                    <span className={plan.highlighted ? 'text-primary-foreground' : 'text-primary'}>
                      {plan.icon}
                    </span>
                  </div>
                  <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? '' : 'text-foreground'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm ${plan.highlighted ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6">
                  {plan.monthlyPrice !== null ? (
                    <>
                      <span className={`text-4xl font-bold ${plan.highlighted ? '' : 'text-foreground'}`}>
                        {isAnnual ? plan.yearlyPrice : plan.monthlyPrice}€
                      </span>
                      <span className={`text-sm ${plan.highlighted ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {t("pricing.perMonth")}
                      </span>
                      {isAnnual && plan.monthlyPrice > 0 && (
                        <p className={`text-xs mt-1 ${plan.highlighted ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                          {t("pricing.perYear")} ({(plan.yearlyPrice ?? 0) * 12}€)
                        </p>
                      )}
                    </>
                  ) : (
                    <span className={`text-2xl font-bold ${plan.highlighted ? '' : 'text-foreground'}`}>
                      {t("pricing.perYear")}
                    </span>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className={`h-5 w-5 flex-shrink-0 mt-0.5 ${feature.included
                        ? plan.highlighted ? 'text-primary-foreground' : 'text-success'
                        : 'text-muted-foreground/40'
                        }`} />
                      <span className={`text-sm ${feature.included
                        ? plan.highlighted ? 'text-primary-foreground' : 'text-foreground'
                        : 'text-muted-foreground/60 line-through'
                        }`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full group ${plan.highlighted
                    ? 'bg-primary-foreground text-primary hover:bg-primary-foreground/90'
                    : ''
                    }`}
                  variant={plan.highlighted ? "default" : plan.ctaVariant}
                  asChild
                >
                  <Link to={
                    plan.id === 'enterprise'
                      ? '/contact'
                      : `/checkout?plan=${plan.id}&billing=${isAnnual ? 'yearly' : 'monthly'}`
                  }>
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("pricing.featuresTitle")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("pricing.featuresSubtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-card rounded-xl p-6 shadow-neu hover:shadow-neu-hover transition-all duration-300 border border-border"
              >
                <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("pricing.faqTitle")}
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-card rounded-xl p-6 shadow-neu border border-border"
              >
                <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-primary rounded-3xl p-12 text-center max-w-4xl mx-auto"
          >
            <MessageSquare className="h-12 w-12 mx-auto mb-6 text-primary-foreground" />
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              {t("pricing.helpTitle")}
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
              {t("pricing.helpSubtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                asChild
              >
                <Link to="/contact">
                  {t("pricing.talkExpert")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <Link to="/checkout?plan=free&billing=monthly">
                  {t("pricing.tryFree")}
                </Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
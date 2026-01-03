import { Link } from "react-router-dom";
import { Cloud } from "lucide-react";

import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Cloud className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg text-foreground">Cloud Industrie</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {t("footer.description")}
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">{t("footer.services.title")}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("footer.services.infrastructure")}
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("footer.services.dataManagement")}
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("footer.services.security")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">{t("footer.company.title")}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("footer.company.about")}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("footer.company.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">{t("footer.legal.title")}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("footer.legal.terms")}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("footer.legal.privacy")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            {t("footer.copyright", { year: new Date().getFullYear(), company: "Cloud Industrie" })}
          </p>
        </div>
      </div>
    </footer>
  );
};

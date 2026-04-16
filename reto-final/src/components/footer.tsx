"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Github, Globe, Instagram } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

const socialLinks = [
  { icon: Github, href: 'https://github.com/platzi', label: 'GitHub' },
  { icon: Globe, href: 'https://platzi.com/home/', label: 'Platzi' },
  { icon: Instagram, href: 'https://www.instagram.com/plat.zistore/', label: 'Instagram' },
]

export function Footer() {
  const { t } = useLanguage()

  const footerLinks = {
    shop: [
      { label: t.footer.allProducts, href: '/catalog', external: false },
      { label: t.footer.premiumCollection, href: '/catalog?collection=premium', external: false },
      { label: t.footer.funCollection, href: '/catalog?collection=fun', external: false },
      { label: t.footer.limitedEdition, href: '/catalog?collection=limited', external: false },
    ],
    company: [
      { label: t.footer.aboutUs, href: 'https://platzi.com/about/', external: true },
      { label: t.footer.contactLink, href: '/contact', external: false },
      { label: t.footer.careers, href: 'https://platzi.com/empleos/', external: true },
    ],
    support: [
      { label: t.footer.faq, href: '/contact', external: false },
      { label: t.footer.shipping, href: '/contact', external: false },
      { label: t.footer.returns, href: '/contact', external: false },
    ],
  }

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <Image src="/platzi-logo.png" alt="Platzi" width={40} height={40} className="w-10 h-10 rounded-xl" />
              <span className="text-xl font-semibold text-foreground">
                Platzi Store
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mb-6">
              {t.footer.tagline}
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center text-muted-foreground transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              {t.footer.shop}
            </h3>
            <ul className="space-y-3">
              {footerLinks.shop.map(link => (
                <li key={link.label}>
                  {link.external ? (
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">{link.label}</a>
                  ) : (
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              {t.footer.company}
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map(link => (
                <li key={link.label}>
                  {link.external ? (
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">{link.label}</a>
                  ) : (
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              {t.footer.support}
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map(link => (
                <li key={link.label}>
                  {link.external ? (
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">{link.label}</a>
                  ) : (
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {t.footer.copyright}
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t.footer.privacy}
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t.footer.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

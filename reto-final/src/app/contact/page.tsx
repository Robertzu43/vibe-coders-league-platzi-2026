import { ContactForm } from '@/components/contact-form'
import { ChatbotCallout } from '@/components/chatbot-callout'

export const metadata = {
  title: 'Contact | Platzi Store',
  description: 'Get in touch with our team. We are here to help with any questions.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
            Get in Touch
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a question about your order or need help finding the perfect product?
            We&apos;re here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Form */}
          <ContactForm />

          {/* Chatbot Callout */}
          <ChatbotCallout />
        </div>
      </div>
    </div>
  )
}

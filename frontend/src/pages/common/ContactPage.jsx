import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from "lucide-react";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function ContactPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-widest">
            Contact Us
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-text mt-3 mb-4">
            Get in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-hover">
              touch
            </span>
          </h1>
          <p className="text-muted text-lg max-w-xl mx-auto">
            Have a question or need support? We're here to help.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            {[
              {
                icon: Mail,
                title: "Email",
                value: "support@ridechain.io",
                desc: "We reply within 24 hours",
              },
              {
                icon: Phone,
                title: "Phone",
                value: "+1 (800) RIDE-000",
                desc: "Mon-Fri, 9am-6pm EST",
              },
              {
                icon: MapPin,
                title: "Office",
                value: "123 Blockchain Ave, San Francisco, CA",
                desc: "Visit us by appointment",
              },
            ].map((info) => (
              <Card key={info.title} hover>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <info.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text">
                      {info.title}
                    </p>
                    <p className="text-sm text-text mt-0.5">{info.value}</p>
                    <p className="text-xs text-muted mt-1">{info.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <h3 className="text-lg font-semibold text-text mb-6">
                Send a Message
              </h3>
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="First Name" placeholder="John" />
                  <Input label="Last Name" placeholder="Doe" />
                </div>
                <Input
                  label="Email"
                  type="email"
                  icon={Mail}
                  placeholder="you@example.com"
                />
                <Input label="Subject" placeholder="How can we help?" />
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-text/80">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Tell us more..."
                    className="w-full px-4 py-3 rounded-xl text-sm bg-secondary/50 border border-border text-text placeholder:text-muted/50 outline-none transition-all duration-200 focus:border-primary/50 focus:shadow-glow focus:bg-secondary/70 resize-none"
                  />
                </div>
                <Button icon={Send}>Send Message</Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

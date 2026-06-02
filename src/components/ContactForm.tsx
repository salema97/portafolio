
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { MdSend } from "react-icons/md";

interface ContactFormProps {
  labels: {
    name: string;
    email: string;
    subject: string;
    message: string;
    submit: string;
  };
  placeholders: {
    name: string;
    email: string;
    subject: string;
    message: string;
  };
  subjectOptions: string[];
}

export default function ContactForm({ labels, placeholders, subjectOptions }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const mailto = `mailto:contactos@salema.dev?subject=${encodeURIComponent(formData.subject || "Portfolio contact")}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
    )}`;
    window.location.href = mailto;
  };

  const fieldClass =
    "min-h-11 bg-background/80 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary";

  return (
    <form
      onSubmit={handleSubmit}
      className="card-premium p-6 md:p-10 space-y-6"
      aria-label="Contact form"
    >
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-foreground">
            {labels.name}
          </Label>
          <Input
            id="name"
            name="name"
            required
            autoComplete="name"
            placeholder={placeholders.name}
            className={fieldClass}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            {labels.email}
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={placeholders.email}
            className={fieldClass}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject" className="text-sm font-medium text-foreground">
          {labels.subject}
        </Label>
        <input type="hidden" name="subject" value={formData.subject} readOnly />
        <Select
          value={formData.subject}
          onValueChange={(value) => setFormData({ ...formData, subject: value })}
        >
          <SelectTrigger id="subject" className={`w-full ${fieldClass}`}>
            <SelectValue placeholder={placeholders.subject} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{labels.subject}</SelectLabel>
              {subjectOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-medium text-foreground">
          {labels.message}
        </Label>
        <Textarea
          id="message"
          name="message"
          required
          placeholder={placeholders.message}
          className={`min-h-[140px] resize-y ${fieldClass}`}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
      </div>

      <Button
        type="submit"
        className="w-full min-h-11 gap-2 bg-primary text-primary-foreground hover:brightness-110 active:scale-[0.98]"
        size="lg"
      >
        <MdSend className="text-xl" aria-hidden />
        {labels.submit}
      </Button>
    </form>
  );
}

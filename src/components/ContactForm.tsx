
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add submission logic here (e.g., mailto or API call)
    alert("Mensaje enviado (simulación)");
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-8 space-y-6 border border-white/10">
      <div className="grid sm:grid-cols-2 gap-6">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {labels.name}
          </Label>
          <Input
            id="name"
            placeholder={placeholders.name}
            className="bg-white/50 dark:bg-white/5 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus-visible:ring-primary"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
           <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {labels.email}
          </Label>
          <Input
            id="email"
            type="email"
            placeholder={placeholders.email}
            className="bg-white/50 dark:bg-white/5 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus-visible:ring-primary"
             value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
      </div>

      {/* Subject */}
      <div className="space-y-2">
        <Label htmlFor="subject" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {labels.subject}
        </Label>
        <Select 
          value={formData.subject} 
          onValueChange={(value) => setFormData({ ...formData, subject: value })}
        >
          <SelectTrigger className="w-full bg-white/50 dark:bg-white/5 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-primary">
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

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {labels.message}
        </Label>
        <Textarea
          id="message"
          placeholder={placeholders.message}
          className="min-h-[120px] bg-white/50 dark:bg-white/5 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus-visible:ring-primary resize-none"
           value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full bg-primary text-white hover:bg-primary-glow hover:shadow-glow transition-all duration-300 gap-2"
        size="lg"
      >
        <MdSend className="text-xl" />
        {labels.submit}
      </Button>
    </form>
  );
}

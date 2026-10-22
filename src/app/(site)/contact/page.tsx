import { Metadata } from "next";
import ContactSection from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: "Contact — Reddix Robotics",
  description:
    "Let’s build the future together. Have a project in mind, a collaboration opportunity, or just want to say hello? Get in touch with Reddix Robotics.",
};

export default function ContactPage() {
  return <ContactSection standalone={true} />;
}

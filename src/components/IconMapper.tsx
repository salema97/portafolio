import React from 'react';
import {
    FaCheck,
    FaCloud,
    FaCode,
    FaHistory,
    FaHtml5,
    FaRocket,
    FaServer
} from "react-icons/fa";
import { MdBadge, MdEmail, MdLocationOn, MdPerson, MdSchool, MdSend, MdWork } from "react-icons/md";

// Define the map
const iconMap: Record<string, React.ElementType> = {
  // Skills
  "html": FaHtml5,
  "dns": FaServer,
  "settings_system_daydream": FaCloud,
  
  // Projects
  "rocket_launch": FaRocket,
  
  // Experience
  "history_edu": FaHistory,
  
  // About
  "person": MdPerson,
  "location_on": MdLocationOn,
  "school": MdSchool,
  "badge": MdBadge,
  "mail": MdEmail, // "mail" isn't in my JSON checks but mapped earlier, keep for safety
  "check": FaCheck,
  
  // Contact
  "send": MdSend,
  
  // Common fallbacks or extras
  "code": FaCode,
  "work": MdWork,
  "email": MdEmail
};

interface IconMapperProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}

export const IconMapper: React.FC<IconMapperProps> = ({ name, className, style }) => {
  const Icon = iconMap[name];
  if (!Icon) {
    // console.warn(`Icon "${name}" not found in IconMapper`); // valid for debugging but maybe noisy 
    return null;
  }
  return <Icon className={className} style={style} />;
};

import React from 'react';

interface IconProps {
  className?: string;
}

const IconWrapper: React.FC<React.PropsWithChildren<IconProps>> = ({ className, children }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

export const CarIcon = (props: IconProps) => <IconWrapper {...props}><path d="M14 16.5 19 12l-5-4.5"/><path d="M9 5.5 4 10l5 4.5"/><path d="m2 10 2 2 2-2"/><path d="m18 12 2-2 2 2"/><path d="M14 16.5v4l-4 .5v-4"/><path d="M10 16.5v4l4 .5v-4"/><path d="m4 12-2 4.5h20L20 12"/><path d="M6 12v-6h12v6"/><path d="M10 16.5h4"/></IconWrapper>;
export const BuildingIcon = (props: IconProps) => <IconWrapper {...props}><rect x="4" y="4" width="16" height="16" rx="2" ry="2" /><line x1="8" y1="22" x2="8" y2="4" /><line x1="16" y1="22" x2="16" y2="4" /><line x1="4" y1="10" x2="20" y2="10" /></IconWrapper>;
export const PhoneIcon = (props: IconProps) => <IconWrapper {...props}><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></IconWrapper>;
export const SofaIcon = (props: IconProps) => <IconWrapper {...props}><path d="M20 9V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2"/><path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v-1a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v1a2 2 0 0 0-4 0Z"/><path d="M4 18v2"/><path d="M20 18v2"/></IconWrapper>;
export const BriefcaseIcon = (props: IconProps) => <IconWrapper {...props}><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></IconWrapper>;
export const LaptopIcon = (props: IconProps) => <IconWrapper {...props}><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="2" y1="20" x2="22" y2="20" /></IconWrapper>;
export const ShirtIcon = (props: IconProps) => <IconWrapper {...props}><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" /></IconWrapper>;
export const WrenchIcon = (props: IconProps) => <IconWrapper {...props}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></IconWrapper>;
export const MoreHorizontalIcon = (props: IconProps) => <IconWrapper {...props}><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></IconWrapper>;
export const TagIcon = (props: IconProps) => <IconWrapper {...props}><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.432 0l6.568-6.568a2.426 2.426 0 0 0 0-3.432L12.586 2.586z" /><circle cx="8" cy="8" r="1" /></IconWrapper>;
export const LocationMarkerIcon = (props: IconProps) => <IconWrapper {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></IconWrapper>;
export const EyeIcon = (props: IconProps) => <IconWrapper {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></IconWrapper>;
export const PlusCircleIcon = (props: IconProps) => <IconWrapper {...props}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></IconWrapper>;
export const EditIcon = (props: IconProps) => <IconWrapper {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></IconWrapper>;
export const TrashIcon = (props: IconProps) => <IconWrapper {...props}><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></IconWrapper>;
export const CameraIcon = (props: IconProps) => <IconWrapper {...props}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></IconWrapper>;
export const UploadCloudIcon = (props: IconProps) => <IconWrapper {...props}><path d="M16 16l-4-4-4 4m8-4v9H8" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></IconWrapper>;
export const XIcon = (props: IconProps) => <IconWrapper {...props}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></IconWrapper>;
export const MenuIcon = (props: IconProps) => <IconWrapper {...props}><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></IconWrapper>;
export const CheckCircleIcon = (props: IconProps) => <IconWrapper {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></IconWrapper>;
export const ClipboardCopyIcon = (props: IconProps) => <IconWrapper {...props}><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /></IconWrapper>;
export const WhatsAppIcon = (props: IconProps) => <IconWrapper {...props}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></IconWrapper>;
export const SearchIcon = (props: IconProps) => <IconWrapper {...props}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></IconWrapper>;
export const ArrowLeftIcon = (props: IconProps) => <IconWrapper {...props}><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></IconWrapper>;
export const SparklesIcon = (props: IconProps) => <IconWrapper {...props}><path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9 1.9 5.8 1.9-5.8 5.8-1.9-5.8-1.9z"/></IconWrapper>;

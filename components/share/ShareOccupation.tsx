"use client";
import { useEffect, useState } from "react";

const socialButtons = [
  {
    name: "facebook",
    color: "bg-secondary hover:bg-[#1877F2]",
    translate: "group-hover:-translate-y-[60px]",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        height={24}
        width={24}
      >
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.988h-2.54v-2.89h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.63.772-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
      </svg>
    ),
    url: (pageUrl: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
  },
  {
    name: "whatsapp",
    color: "bg-secondary hover:bg-[#25D366]",
    translate: "group-hover:translate-x-[36px] group-hover:translate-y-[36px]",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        height={24}
        width={24}
      >
        <path d="M19.001 4.908A9.817 9.817 0 0 0 11.992 2C6.534 2 2.085 6.448 2.08 11.908c0 1.748.458 3.45 1.321 4.956L2 22l5.255-1.377a9.916 9.916 0 0 0 4.737 1.206h.005c5.46 0 9.908-4.448 9.913-9.913A9.872 9.872 0 0 0 19 4.908h.001ZM11.992 20.15A8.216 8.216 0 0 1 7.797 19l-.3-.18-3.117.818.833-3.041-.196-.314a8.2 8.2 0 0 1-1.258-4.381c0-4.533 3.696-8.23 8.239-8.23a8.2 8.2 0 0 1 5.825 2.413 8.196 8.196 0 0 1 2.41 5.825c-.006 4.55-3.702 8.24-8.24 8.24Z" />
      </svg>
    ),
    url: (pageUrl: string) => `https://wa.me/?text=${encodeURIComponent(pageUrl)}`,
  },
  {
    name: "messenger",
    color: "bg-secondary hover:bg-[#0093FF]",
    translate: "group-hover:-translate-x-[36px] group-hover:-translate-y-[36px]",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        height={24}
        width={24}
      >
        <path d="M2 11.7C2 6.126 6.366 2 12 2s10 4.126 10 9.7c0 5.574-4.366 9.7-10 9.7-1.012 0-1.982-.134-2.895-.384a.799.799 0 0 0-.534.038l-1.985.877a.8.8 0 0 1-1.122-.707l-.055-1.779a.799.799 0 0 0-.269-.57C3.195 17.135 2 14.615 2 11.7Zm6.932-1.824-2.937 4.66c-.281.448.268.952.689.633l3.156-2.395a.6.6 0 0 1 .723-.003l2.336 1.753a1.501 1.501 0 0 0 2.169-.4l2.937-4.66c.283-.448-.267-.952-.689-.633l-3.156 2.395a.6.6 0 0 1-.723.003l-2.336-1.754a1.5 1.5 0 0 0-2.169.4v.001Z" />
      </svg>
    ),
    url: (pageUrl: string) => `https://www.messenger.com/share/?u=${encodeURIComponent(pageUrl)}`,
  },
    {name: "discord",
    color: "bg-secondary hover:bg-[#5865F2]",
    translate: "group-hover:translate-x-[60px]",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        height={30}
        width={30}
      >
        <path d="M18.654 6.368a15.87 15.87 0 0 0-3.908-1.213.06.06 0 0 0-.062.03c-.17.3-.357.693-.487 1a14.628 14.628 0 0 0-4.39 0 9.911 9.911 0 0 0-.494-1 .061.061 0 0 0-.063-.03c-1.35.233-2.664.64-3.908 1.213a.05.05 0 0 0-.025.022c-2.49 3.719-3.172 7.346-2.837 10.928a.068.068 0 0 0 .025.045 15.936 15.936 0 0 0 4.794 2.424.06.06 0 0 0 .067-.023c.37-.504.699-1.036.982-1.595a.06.06 0 0 0-.034-.084 10.65 10.65 0 0 1-1.497-.714.06.06 0 0 1-.024-.08.06.06 0 0 1 .018-.022c.1-.075.201-.155.297-.234a.06.06 0 0 1 .061-.008c3.143 1.435 6.545 1.435 9.65 0a.062.062 0 0 1 .033-.005.061.061 0 0 1 .03.013c.096.08.197.159.298.234a.06.06 0 0 1 .016.081.062.062 0 0 1-.021.021c-.479.28-.98.518-1.499.713a.06.06 0 0 0-.032.085c.288.558.618 1.09.98 1.595a.06.06 0 0 0 .067.023 15.885 15.885 0 0 0 4.802-2.424.06.06 0 0 0 .025-.045c.4-4.14-.671-7.738-2.84-10.927a.04.04 0 0 0-.024-.023Zm-9.837 8.769c-.947 0-1.726-.87-1.726-1.935 0-1.066.765-1.935 1.726-1.935.968 0 1.74.876 1.726 1.935 0 1.066-.765 1.935-1.726 1.935Zm6.38 0c-.946 0-1.726-.87-1.726-1.935 0-1.066.764-1.935 1.725-1.935.969 0 1.741.876 1.726 1.935 0 1.066-.757 1.935-1.726 1.935Z" />
      </svg>
    ),
    url: (pageUrl: string) => `https://discord.com/invite/${encodeURIComponent(pageUrl)}`,
  },
  {
    name: "x",
    color: "bg-secondary hover:bg-[#1CA1F1]",
    translate: "group-hover:translate-x-[36px] group-hover:-translate-y-[36px]",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        height={30}
        width={30}
      >
        <path d="M8.432 19.8c7.245 0 11.209-6.005 11.209-11.202 0-.168 0-.338-.007-.506A8.023 8.023 0 0 0 21.6 6.049a7.99 7.99 0 0 1-2.266.622 3.961 3.961 0 0 0 1.736-2.18 7.84 7.84 0 0 1-2.505.951 3.943 3.943 0 0 0-6.715 3.593A11.19 11.19 0 0 1 3.73 4.92a3.947 3.947 0 0 0 1.222 5.259 3.989 3.989 0 0 1-1.784-.49v.054a3.946 3.946 0 0 0 3.159 3.862 3.964 3.964 0 0 1-1.775.069 3.939 3.939 0 0 0 3.68 2.733 7.907 7.907 0 0 1-4.896 1.688 7.585 7.585 0 0 1-.936-.054A11.213 11.213 0 0 0 8.432 19.8Z" />
      </svg>
    ),
    url: (pageUrl: string) => `https://x.com/intent/tweet?url=${encodeURIComponent(pageUrl)}`,
  },
  {
    name: "reddit",
    color: "bg-secondary hover:bg-[#FF4500]",
    translate: "group-hover:-translate-x-[60px]",
    svg: (
      <svg
        width={30}
        height={30}
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.708 12a1.039 1.039 0 0 0-1.037 1.037c0 .574.465 1.05 1.037 1.04a1.04 1.04 0 0 0 0-2.077Zm2.304 4.559c.394 0 1.754-.048 2.47-.764a.29.29 0 0 0 0-.383.266.266 0 0 0-.382 0c-.442.454-1.408.61-2.088.61-.681 0-1.635-.156-2.089-.61a.266.266 0 0 0-.382 0 .266.266 0 0 0 0 .383c.705.704 2.065.763 2.471.763Zm1.24-3.509a1.04 1.04 0 0 0 1.039 1.037c.572 0 1.037-.476 1.037-1.037a1.039 1.039 0 0 0-2.075 0Z" />
        <path d="M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Zm-4.785-1.456c-.394 0-.753.155-1.015.406-1.001-.716-2.375-1.181-3.901-1.241l.667-3.127 2.173.466a1.038 1.038 0 1 0 1.037-1.087 1.037 1.037 0 0 0-.93.585l-2.422-.512a.254.254 0 0 0-.264.106.232.232 0 0 0-.035.096l-.74 3.485c-1.55.048-2.947.513-3.963 1.24a1.466 1.466 0 0 0-1.927-.082 1.454 1.454 0 0 0 .318 2.457 2.542 2.542 0 0 0-.037.441c0 2.244 2.614 4.07 5.836 4.07 3.222 0 5.835-1.813 5.835-4.07a2.73 2.73 0 0 0-.036-.44c.502-.227.86-.74.86-1.337 0-.813-.656-1.456-1.456-1.456Z" />
      </svg>
    ),
    url: (pageUrl: string) => `https://www.reddit.com/submit?url=${encodeURIComponent(pageUrl)}`,
  },
  // Add other buttons here following the same structure
];

export const ShareOccupation = () => {
    const [open, setOpen] = useState(false);
    const pageUrl = typeof window !== "undefined" ? window.location.href : "";

    useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setOpen(false);
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, []);

    const handleShare = (url: string) => {
        window.open(url, "_blank", "noopener,noreferrer,width=600,height=600");
      };
    return (
      <div className="relative flex items-center justify-center">
      <div className="relative grid place-items-center group">
        {/* Invisible hover buffer to keep hover active while moving to icons */}
        <div className="absolute -inset-6 z-0" aria-hidden="true"></div>
          {/* Main button */}
          <button
          onClick={() => setOpen(!open)}
          className="btn-icon z-20"
            aria-label="Share this page"
            title="Share this page"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
            <span className="sr-only">Share this page</span>
          </button>
  
          {/* Social buttons - appear on hover or when open, with smooth non-overlapping transforms */}
          {socialButtons.map((btn: any, idx: number) => {
            const openTransform = btn.translate.replace(/group-hover:/g, '');
            return (
            <button
              key={btn.name}
              className={`absolute p-3 rounded-lg bg-white shadow-lg transition-transform duration-200 ease-out ${btn.translate} ${btn.color} cursor-pointer z-30
                opacity-0 group-hover:opacity-100 ${open ? `opacity-100 ${openTransform}` : ''}`}
              style={{ transitionDelay: `${idx * 0.05}s` }}
              aria-label={`Share via ${btn.name}`}
              onClick={() => handleShare(btn.url(pageUrl))}
            >
              {btn.svg}
            </button>
          );})}
        </div>
      </div>
    );
  };

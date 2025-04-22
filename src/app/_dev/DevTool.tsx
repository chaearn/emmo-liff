import { useEffect } from 'react';

export default function DevTool() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDev = process.env.NODE_ENV !== 'production';
      const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);

      if (isDev && isMobile) {
        import('eruda').then((eruda) => {
          eruda.default.init();
          console.log('[🛠️ Eruda] Dev console activated');
        });
      }
    }
  }, []);

  return null;
}

import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  // Try to get locale from cookie, fallback to 'sv'
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'sv';

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
